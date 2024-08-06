import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
  UseGuards,
  applyDecorators,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { NextralService } from 'src/modules/nextral/nextral.service';

import config from '../config/config';
import { HttpStatus } from 'src/enums/http-status.enum';

const ZENITH_WALLET_BASIC = config.game_api.zenith.wallet.basic;

@Injectable()
class NextralAuthGuard implements CanActivate {
  constructor(private readonly nextralService: NextralService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();

    const signature = req.headers?.['x-cero-signature'] || '';
    const isDecryptOk = this.nextralService.isRequestSignatureValid(signature, req.body);

    if (!isDecryptOk) {
      throw new HttpException(
        { error: { errorCode: 'DECRYPTION_FAILURE', errorMessage: 'Signature not valid' } },
        HttpStatus.BAD_REQUEST,
      );
    }

    return isDecryptOk;
  }
}

@Injectable()
class NextralBasicAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    const basic = (req.headers?.authorization || '').split(' ')[1];

    return basic === ZENITH_WALLET_BASIC;
  }
}

export const NextralSecure = () => applyDecorators(UseGuards(NextralAuthGuard));
export const NextralBasicSecure = () => applyDecorators(UseGuards(NextralBasicAuthGuard));
