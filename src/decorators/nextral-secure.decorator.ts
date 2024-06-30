import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UseGuards,
  applyDecorators,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { NextralService } from 'src/modules/wallet/nextral.service';

@Injectable()
class NextralAuthGuard implements CanActivate {
  constructor(private readonly nextralService: NextralService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();

    const signature = req.headers?.authorization;

    if (!signature) {
      return false;
    }

    return this.nextralService.isRequestSignatureValid(signature, req.body);
  }
}

export const NextralSecure = () => applyDecorators(UseGuards(NextralAuthGuard));
