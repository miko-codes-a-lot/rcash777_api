import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import config from 'src/config/config';

@Injectable()
export class GenerateToken {
  constructor(private jwtService: JwtService) {}

  get(id, email) {
    const generate = (expiresIn) => {
      return this.jwtService.sign(
        { id: id, email },
        {
          expiresIn,
        },
      );
    };

    return {
      access_token: generate(config.jwt.accessExpirationMinutes + 'm'),
      refresh_token: generate(config.jwt.refreshExpirationDays + 'd'),
    };
  }
}
