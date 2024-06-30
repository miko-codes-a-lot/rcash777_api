import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import crypto from 'crypto';
import config from '../../config/config';
import { FormLaunchGameDTO } from '../game/dto/form-launch-game.dto';
import { v4 as uuid } from 'uuid';
import { DataSource } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { GameSession } from '../game/entities/game-session.entity';
import { map } from 'rxjs';

const ZENITH_TOKEN = config.game_api.zenith.token;
const ZENITH_URI = config.game_api.zenith.uri;

@Injectable()
export class NextralService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly http: HttpService,
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

    const ceroKey = 'xkre3O7uOQn6zxwgq2xs1sISeDb6gy3k0LqZiYzBIYqTPxVlGKqpTYEDBhw4xf5E';
    const hash = crypto
      .createHash('md5')
      .update(sortedParams + ceroKey)
      .digest('hex');

    return hash === requestSignature;
  }
}
