import { CanActivate, Injectable } from '@nestjs/common';
import {
  ExecutionContext,
  UnauthorizedException,
  UseGuards,
  applyDecorators,
} from '@nestjs/common';

import { AccessTypes } from 'src/types/auth-access.type';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/modules/user/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  requiredRoles: string[] = [];

  constructor(requiredRoles: string[]) {
    this.requiredRoles = requiredRoles;
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user as User;

    const validatedRoles = this.requiredRoles.map((role) => user[role]);
    const isValid = validatedRoles.some((role) => !!role);

    if (!isValid) {
      throw new UnauthorizedException(this.requiredRoles.toString() + ' role is required');
    }

    return true;
  }
}

export const AuthHasAccess = (requiredRoles: AccessTypes[]) =>
  applyDecorators(UseGuards(AuthGuard('jwt'), new RolesGuard(requiredRoles)));