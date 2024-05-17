import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { IPostAuthLoginRequest, IPostAuthLoginResponse } from './interfaces/post-auth.interface';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(Users) private usersRepository: Repository<Users>,
  ) {}

  async authenticate(data: IPostAuthLoginRequest): Promise<IPostAuthLoginResponse> {
    const { email, password } = data;
    const userDetails = await this.usersRepository.createQueryBuilder('user').where('user.email = :email', { email }).addSelect('user.password').getOne();
    const isPasswordValid = bcrypt.compareSync(password, userDetails?.password || '');

    if (!userDetails || !isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return {
      access_token: this.jwtService.sign({ id: userDetails.id, email }),
    };
  }
}
