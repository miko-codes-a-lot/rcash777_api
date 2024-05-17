import { UseGuards, applyDecorators } from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';

export const AuthRequired = () => applyDecorators(UseGuards(AuthGuard('jwt')) as PropertyDecorator);
