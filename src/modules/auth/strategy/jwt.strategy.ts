import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthService } from '../auth.service';
import { PassportStrategy } from '@nestjs/passport';
import { UserService } from 'src/modules/user/user.service';
import config from 'src/config/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.jwt.secret,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, { iat, exp, id }, done): Promise<boolean> {
    const rawToken = req.headers['authorization'].split(' ')[1];
    const timeDiff = exp - iat;

    if (timeDiff <= 0) {
      throw new UnauthorizedException();
    } else {
      const auth = await this.authService.get().findOne({ where: { user_id: id, access_token: rawToken } });

      if (!auth) {
        throw new UnauthorizedException();
      } else {
        const user = await this.userService.findById(id);

        if (!user) {
          throw new UnauthorizedException();
        }

        done(null, user);

        return true;
      }
    }
  }
}
