import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UseGuards,
  applyDecorators,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { NextralService } from 'src/modules/wallet/nextral.service';

import config from '../config/config';

const ZENITH_WALLET_BASIC = config.game_api.zenith.wallet.basic;

@Injectable()
class NextralAuthGuard implements CanActivate {
  constructor(private readonly nextralService: NextralService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();

    const signature = req.headers?.authorization['x-cero-signature'];

    if (!signature) {
      return false;
    }

    return this.nextralService.isRequestSignatureValid(signature, req.body);
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
