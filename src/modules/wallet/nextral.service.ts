import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import crypto from 'crypto';
import config from '../../config/config';
import { FormLaunchGameDTO } from '../game/dto/form-launch-game.dto';
import { v4 as uuid } from 'uuid';
import { DataSource } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { GameSession } from '../game/entities/game-session.entity';
import { map } from 'rxjs';
import { FormAuthDTO } from './dto/form-auth.dto';
import { Game } from '../game/entities/game.entity';
import { CoinTransactionService } from '../coin-transaction/coin-transaction.service';

const ZENITH_TOKEN = config.game_api.zenith.token;
const ZENITH_URI = config.game_api.zenith.uri;
const ZENITH_API_KEY = config.game_api.zenith.apiKey;

@Injectable()
export class NextralService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly http: HttpService,
    private readonly coinService: CoinTransactionService,
  ) {}

  async launch(user: User, data: FormLaunchGameDTO) {
    return this.dataSource.transaction(async (manager) => {
      const gsRepo = manager.getRepository(GameSession);

      const tokenUUID = uuid();

      data.token = tokenUUID;
      data.clientCode = 'GF77';
      data.urls.exitUrl = 'https://20a57c0cb5fa.ngrok.app/api/game';
      data.urls.depositUrl = 'https://20a57c0cb5fa.ngrok.app/api/game';

      const gameSession = new GameSession();
      gameSession.token = tokenUUID;
      gameSession.user = user;

      await gsRepo.save(gameSession);

      return this.http
        .post<{ playUrl: string }>(`${ZENITH_URI}/play/v2`, data, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${ZENITH_TOKEN}`,
          },
        })
        .pipe(map((res) => res.data));
    });
  }

  async authenticate(user: User, data: FormAuthDTO) {
    return this.dataSource.transaction(async (manager) => {
      const gsRepo = manager.getRepository(GameSession);
      const gameRepo = manager.getRepository(Game);

      const game = await gameRepo.findOne({
        where: {
          code: data.game,
        },
      });

      if (!game) {
        throw new HttpException(
          {
            error: {
              errorCode: 'GAME_NOT_FOUND',
              errorMessage: 'Game not found',
            },
          },
          HttpStatus.NOT_FOUND,
        );
      }

      const session = await gsRepo.findOne({
        where: {
          user: {
            id: user.id,
          },
          token: data.token,
        },
      });

      if (!session) {
        throw new HttpException(
          {
            error: {
              errorCode: 'TOKEN_NOT_FOUND',
              errorMessage: 'Token is already validated or invalid',
            },
          },
          HttpStatus.NOT_FOUND,
        );
      }

      const balance = await this.coinService.computeBalance(user.id);

      return {
        client: 'GF77',
        currency: 'PHP',
        testAccount: 'false',
        country: 'PHP',
        affiliate: 'aff-1',
        jurisdiction: '',
        player: user.id,
        balance,
      };
    });
  }

  isRequestSignatureValid(payload: { [key: string]: any }, requestSignature: string) {
    payload = {
      token: null,
      device: 'Iphone 14',
      gameCode: 'GAME_1',
      platform: 'DESKTOP',
    };

    const keys = Object.keys(payload).sort();

    const template = keys.join('=&') + '=';

    const sortedParams = keys.reduce((acc, key) => {
      return acc.replace(`${key}=`, `${key}=${payload[key] || ''}`);
    }, template);

    const hash = crypto
      .createHash('md5')
      .update(sortedParams + ZENITH_API_KEY)
      .digest('hex');

    return hash === requestSignature;
  }
}
