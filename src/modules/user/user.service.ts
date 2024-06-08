import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ERoles } from 'src/enums/roles.enum';
import { Pagination, PaginationResponse } from 'src/schemas/pagination.schema';
import { BaseService } from 'src/services/base.service';
import { PostUserNewRequest } from './schemas/post-user-new.schema';
import { PostUserUpdateRequest } from './schemas/put-user-update.schema';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {
    super();
    this.repository = userRepository;
  }

  async create(data: PostUserNewRequest) {
    const user = new User();

    user.email = data.email;
    user.firstName = data.firstName;
    user.lastName = data.lastName;
    user.phoneNumber = data.phoneNumber;
    user.address = data.address;
    user.password = bcrypt.hashSync(data.password, 10);
    // user.role = ERoles.USER;

    try {
      return await this.userRepository.save(user);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: string, payload: PostUserUpdateRequest) {
    const user = await this.findById(id);

    user.firstName = payload.firstName;
    user.lastName = payload.lastName;
    user.phoneNumber = payload.phoneNumber;
    user.address = payload.address;

    return await this.userRepository.save(user);
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }

  async findAllUserPaginate(pagination: Pagination): Promise<PaginationResponse<User>> {
    return await super.findAllPaginate(pagination, {
      fields: ['phoneNumber', 'address'],
    });
  }
}
