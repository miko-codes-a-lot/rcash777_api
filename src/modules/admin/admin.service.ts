import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { ERoles } from 'src/enums/roles.enum';
import { IPostUserRoleRequest } from './interfaces/post-user-role.interface';

@Injectable()
export class AdminService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

  async findAllAdmin() {
    return await this.userRepository.find({ where: { role: ERoles.ADMIN } });
  }

  async updateRole(user: User, payload: IPostUserRoleRequest) {
    user.role = payload.new_role;
    return await this.userRepository.save(user);
  }
}
