import { Controller, Post, Body, Delete, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { Validate } from 'src/decorators/validate.decorator';
import { Response } from 'express';
import { AuthRequired } from 'src/decorators/auth-required.decorator';
import { HttpStatus } from 'src/enums/http-status.enum';
import { RequestUser } from 'src/decorators/request-user.decorator';
import {
  PostAuthLoginRequest,
  PostAuthLoginRequestSchema,
  PostAuthLoginResponse,
} from './schemas/post-auth-login.schema';
import {
  PostPasswordChangeRequest,
  PostPasswordChangeRequestSchema,
} from './schemas/post-password-change.schema';
import {
  PostRefreshTokenRequest,
  PostRefreshTokenRequestSchema,
} from './schemas/post-refresh-token.schema';
import { User } from '../user/entities/user.entity';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Validate({ body: PostAuthLoginRequestSchema })
  async authenticate(@Body() payload: PostAuthLoginRequest): Promise<PostAuthLoginResponse> {
    return await this.authService.authenticate(payload);
  }

  @Post('password-change')
  @AuthRequired()
  @Validate({ body: PostPasswordChangeRequestSchema })
  async passwordChange(
    @Body() payload: PostPasswordChangeRequest,
    @RequestUser() user: User,
    @Res() res: Response,
  ) {
    await this.authService.passwordChange(user.id, payload.old_password, payload.new_password);

    res.status(HttpStatus.SUCCESS).send();
  }

  @Delete('logout')
  @AuthRequired()
  async logout(@RequestUser() user: User, @Res() res: Response) {
    await this.authService.delete(user.id);

    res.status(HttpStatus.SUCCESS).send();
  }

  @Post('refresh-token')
  @Validate({ body: PostRefreshTokenRequestSchema })
  async refreshToken(@Body() payload: PostRefreshTokenRequest) {
    return this.authService.refreshToken(payload.refresh_token);
  }
}
