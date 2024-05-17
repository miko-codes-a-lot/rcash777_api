import { CanActivate, Injectable } from '@nestjs/common';
import { ExecutionContext, UnauthorizedException, UseGuards, applyDecorators } from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { ERoles } from 'src/enums/roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || user.role !== ERoles.ADMIN) {
      throw new UnauthorizedException('Admin role is required');
    }

    return true;
  }
}

export const AuthAdminOnly = () => applyDecorators(UseGuards(AuthGuard('jwt'), RolesGuard) as PropertyDecorator);
