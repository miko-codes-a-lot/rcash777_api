import { Controller, Post, Body, Req, Delete, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { PostAuthLoginRequest } from './dto/post-auth-login-request';
import { IPostAuthLoginRequest, IPostAuthLoginResponse } from './interfaces/post-auth.interface';
import { Validate } from 'src/decorators/validate.decorator';
import { PostPasswordChangeRequest } from './dto/post-password-change-request';
import { IPostPasswordChangeRequest } from './interfaces/post-password-change.interface';
import { IUser } from '../user/interfaces/user.interface';
import { Request, Response } from 'express';
import { AuthRequired } from 'src/decorators/auth-required.decorator';
import { PostRefreshTokenRequest } from './dto/post-refresh-token-request';
import { IPostRefreshTokenRequest } from './interfaces/post-refresh-token.interface';
import { EResponse } from 'src/enums/response.enum';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Validate({ body: PostAuthLoginRequest })
  async authenticate(@Body() payload: IPostAuthLoginRequest): Promise<IPostAuthLoginResponse> {
    return await this.authService.authenticate(payload);
  }

  @Post('password-change')
  @AuthRequired()
  @Validate({ body: PostPasswordChangeRequest })
  async passwordChange(
    @Body() payload: IPostPasswordChangeRequest,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const user = req.user as IUser;
    await this.authService.passwordChange(user.id, payload.old_password, payload.new_password);

    res.status(EResponse.SUCCESS).send();
  }

  @Delete('logout')
  @AuthRequired()
  async logout(@Req() req: Request, @Res() res: Response) {
    const user = req.user as IUser;
    await this.authService.delete(user.id);

    res.status(EResponse.SUCCESS).send();
  }

  @Post('refresh-token')
  @Validate({ body: PostRefreshTokenRequest })
  async refreshToken(@Body() payload: IPostRefreshTokenRequest) {
    return this.authService.refreshToken(payload.refresh_token);
  }
}
