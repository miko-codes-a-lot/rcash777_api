import { Injectable } from '@nestjs/common';
import crypto from 'crypto';

@Injectable()
export class CeroService {
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
