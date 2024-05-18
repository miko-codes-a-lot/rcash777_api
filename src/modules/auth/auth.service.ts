import { BadRequestException, Injectable, NotFoundException, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { IPostAuthLoginRequest, IPostAuthLoginResponse } from './interfaces/post-auth.interface';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async authenticate(data: IPostAuthLoginRequest): Promise<IPostAuthLoginResponse> {
    const { email, password } = data;
    const userDetails = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .addSelect('user.password')
      .getOne();
    const isPasswordValid = bcrypt.compareSync(password, userDetails?.password || '');

    if (!userDetails || !isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return {
      access_token: this.jwtService.sign({ id: userDetails.id, email }),
    };
  }

  async passwordChange(id: number, old_password: string, newPassword: string) {
    const userDetails = await this.userRepository
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
      return await this.userRepository.save(userDetails);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
