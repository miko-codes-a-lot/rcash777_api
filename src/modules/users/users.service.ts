import { InjectRepository } from '@nestjs/typeorm';
import { IPostUserNewRequest } from './interfaces/post-user-new.interface';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Users } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ERoles } from 'src/enums/roles.enum';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(Users) private usersRepository: Repository<Users>) {}

  async create(data: IPostUserNewRequest) {
    const users = new Users();

    users.email = data.email;
    users.first_name = data.first_name;
    users.last_name = data.last_name;
    users.phone_number = data.phone_number;
    users.address = data.address;
    users.password = bcrypt.hashSync(data.password, 10);
    users.role = ERoles.USER;

    try {
      return await this.usersRepository.save(users);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findByEmail(email: string) {
    return await this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: number) {
    return await this.usersRepository.findOne({ where: { id } });
  }

  async findAll() {
    return await this.usersRepository.find();
  }
}
