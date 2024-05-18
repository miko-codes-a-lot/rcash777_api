import { InjectRepository } from '@nestjs/typeorm';
import { IPostUserNewRequest } from './interfaces/post-user-new.interface';
import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ERoles } from 'src/enums/roles.enum';
import { IPostUserUpdateRequest } from './interfaces/put-user-update.interface';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

  async create(data: IPostUserNewRequest) {
    const user = new User();

    user.email = data.email;
    user.first_name = data.first_name;
    user.last_name = data.last_name;
    user.phone_number = data.phone_number;
    user.address = data.address;
    user.password = bcrypt.hashSync(data.password, 10);
    user.role = ERoles.USER;

    try {
      return await this.userRepository.save(user);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: number, payload: IPostUserUpdateRequest) {
    const user = await this.findById(id);

    user.first_name = payload.first_name;
    user.last_name = payload.last_name;
    user.phone_number = payload.phone_number;
    user.address = payload.address;

    return await this.userRepository.save(user);
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }

  async findById(id: number) {
    return await this.userRepository.findOne({ where: { id } });
  }

  async findAll() {
    return await this.userRepository.find();
  }
}
