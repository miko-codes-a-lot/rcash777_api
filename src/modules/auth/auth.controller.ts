import { Controller, Post, Body, Req, InternalServerErrorException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { PostAuthLoginRequest } from './dto/post-auth-login-request';
import { IPostAuthLoginRequest, IPostAuthLoginResponse } from './interfaces/post-auth.interface';
import { Payload } from 'src/decorators/payload.decorator';
import { PostPasswordChangeRequest } from './dto/post-password-change-request';
import { IPostPasswordChangeRequest } from './interfaces/post-password-change.interface';
import { IUser } from '../user/interfaces/user.interface';
import { Request } from 'express';
import { AuthRequired } from 'src/decorators/auth-required.decorator';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Payload(PostAuthLoginRequest)
  async authenticate(@Body() payload: IPostAuthLoginRequest): Promise<IPostAuthLoginResponse> {
    return await this.authService.authenticate(payload);
  }

  @Post('password-change')
  @AuthRequired()
  @Payload(PostPasswordChangeRequest)
  async passwordChange(@Body() payload: IPostPasswordChangeRequest, @Req() req: Request) {
    const user = req.user as IUser;
    await this.authService.passwordChange(user.id, payload.old_password, payload.new_password);

    return null;
  }
}
