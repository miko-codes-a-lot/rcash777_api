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

const ZENITH_OPERATION_BASIC = config.game_api.zenith.operation.basic;
const ZENITH_URI = config.game_api.zenith.uri;
const ZENITH_API_KEY = config.game_api.zenith.apiKey;
const GAME_API_ZENITH_EXIT_URI = config.game_api.zenith.exitURI;
const GAME_API_ZENITH_DEPOSIT_URI = config.game_api.zenith.depositURI;

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
      data.urls.exitUrl = GAME_API_ZENITH_EXIT_URI; // deposit
      data.urls.depositUrl = GAME_API_ZENITH_DEPOSIT_URI; // deposit place

      const gameSession = new GameSession();
      gameSession.token = tokenUUID;
      gameSession.user = user;

      await gsRepo.save(gameSession);

      return this.http
        .post<{ playUrl: string }>(`${ZENITH_URI}/play/v2`, data, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${ZENITH_OPERATION_BASIC}`,
          },
        })
        .pipe(map((res) => res.data));
    });
  }

  async authenticate(data: FormAuthDTO) {
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
          token: data.token,
        },
        relations: { user: true },
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

      const isProd = process.env.NODE_ENV === 'production';

      if (isProd) {
        await gsRepo.remove(session);
      }

      const balance = await this.coinService.computeBalance(session.user.id);

      return {
        client: 'GF77',
        currency: 'PHP',
        testAccount: !isProd,
        country: 'PHP',
        affiliate: 'aff-1',
        jurisdiction: '',
        player: session.user.id,
        balance,
      };
    });
  }

  computeSignature(payload: { [key: string]: any }, apiKey: string) {
    const keys = Object.keys(payload).sort();

    const sortedParams = keys
      .map((key) => {
        const value = payload[key];
        if (value === undefined || value === null) {
          return '';
        }
        return `${key}=${value.toString()}`;
      })
      .filter((part) => part !== '')
      .join('&');

    return crypto
      .createHash('md5')
      .update(sortedParams + apiKey)
      .digest('hex');
  }

  isRequestSignatureValid(requestSignature: string, payload?: { [key: string]: any }) {
    const signature = this.computeSignature(payload, ZENITH_API_KEY).toUpperCase();
    return signature === requestSignature;
  }
}
