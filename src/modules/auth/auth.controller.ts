import { Controller, Post, Body, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ValidateRequest } from 'src/pipes/validate-request';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { joiToSwagger } from 'src/utils/joi-to-swagger';
import { PostAuthLoginRequest } from './dto/post-auth-login-request';
import { IPostAuthLoginRequest, IPostAuthLoginResponse } from './interfaces/post-auth.interface';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiBody({ schema: joiToSwagger(PostAuthLoginRequest) })
  @UsePipes(new ValidateRequest(PostAuthLoginRequest))
  async authenticate(@Body() request: IPostAuthLoginRequest): Promise<IPostAuthLoginResponse> {
    return await this.authService.authenticate(request);
  }
}
