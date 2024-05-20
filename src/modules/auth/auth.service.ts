import * as bcrypt from 'bcrypt';

import { BadRequestException, Injectable, NotFoundException, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { IPostAuthLoginRequest, IPostAuthLoginResponse } from './interfaces/post-auth.interface';

import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { Auth } from './entities/auth.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import config from 'src/config/config';
import { PostRefreshTokenResponse } from './interfaces/post-refresh-token.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth) private authRepository: Repository<Auth>,
    private jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  get() {
    return this.authRepository;
  }

  set(auth: Auth) {
    return this.authRepository.save(auth);
  }

  async findByUserId(id: number) {
    return await this.authRepository.findOne({ where: { user_id: id } });
  }

  async delete(id: number) {
    const auth = await this.findByUserId(id);

    return this.authRepository.remove(auth);
  }

  generateToken(id, email) {
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

  async authenticate(data: IPostAuthLoginRequest): Promise<IPostAuthLoginResponse> {
    const { email, password } = data;
    const userDetails = await this.userService
      .get()
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .addSelect('user.password')
      .getOne();
    const isPasswordValid = bcrypt.compareSync(password, userDetails?.password || '');
    let accessToken: string;
    let refreshToken: string;

    if (!userDetails || !isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    } else {
      const tokens = this.generateToken(userDetails.id, email);
      let auth = await this.findByUserId(userDetails.id);

      accessToken = tokens.access_token;
      refreshToken = tokens.refresh_token;

      if (!auth) {
        auth = new Auth();
      }

      auth.user_id = userDetails.id;
      auth.access_token = accessToken;
      auth.refresh_token = refreshToken;

      await this.authRepository.save(auth);
    }

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async passwordChange(id: number, old_password: string, newPassword: string) {
    const userDetails = await this.userService
      .get()
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .addSelect('user.password')
      .getOne();

    if (!userDetails) {
      throw new NotFoundException('User not found');
    } else {
      const isOldPasswordValid = bcrypt.compareSync(old_password, userDetails?.password || '');

      if (!isOldPasswordValid) {
        throw new UnprocessableEntityException('Invalid old password');
      }
    }

    userDetails.password = bcrypt.hashSync(newPassword, 10);

    try {
      return await this.userService.set(userDetails);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async refreshToken(refreshToken: string): Promise<PostRefreshTokenResponse> {
    const { iat, exp, id } = this.jwtService.decode(refreshToken);
    const timeDiff = exp - iat;
    const authDetails = await this.authRepository.findOne({ where: { user_id: id, refresh_token: refreshToken } });
    const userDetails = await this.userService.findById(id);

    if (!authDetails || !userDetails || timeDiff <= 0) {
      throw new UnauthorizedException('Invalid refresh_token');
    }

    const { access_token } = this.generateToken(id, userDetails.email);

    authDetails.access_token = access_token;
    await this.authRepository.save(authDetails);

    return {
      access_token,
    };
  }
}
