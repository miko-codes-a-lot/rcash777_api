import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { PassportStrategy } from '@nestjs/passport';
import { UsersService } from 'src/modules/users/users.service';
import config from 'src/config/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.jwt.secret,
    });
  }

  async validate({ iat, exp, _id }, done): Promise<boolean> {
    const timeDiff = exp - iat;
    if (timeDiff <= 0) {
      throw new UnauthorizedException();
    }

    const user = await this.usersService.findById(_id);

    if (!user) {
      throw new UnauthorizedException();
    }

    done(null, user);

    return true;
  }
}
