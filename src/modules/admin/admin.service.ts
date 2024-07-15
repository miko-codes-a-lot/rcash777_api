import * as bcrypt from 'bcrypt';

import { BadRequestException, Injectable } from '@nestjs/common';

import { ERoles } from 'src/enums/roles.enum';
import { Pagination } from 'src/schemas/pagination.schema';
import { PutUserInfoRequest } from './schemas/put-user-info.schema';
import { PutUserPassword } from './schemas/put-user-password.schema';
import { PutUserRoleRequest } from './schemas/put-user-role.schema';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class AdminService {
  constructor(private readonly userService: UserService) {}

  async findAllAdminPaginate(pagination: Pagination) {
    return await this.userService.findAllPaginate(pagination, {
      where: {
        role: ERoles.ADMIN,
      },
    });
  }

  async updateUserInfo(user: User, payload: PutUserInfoRequest) {
    user.email = payload.email;
    user.firstName = payload.firstName;
    user.lastName = payload.lastName;
    user.address = payload.address;

    return await this.userService.set(user);
  }

  async updateUserRole(user: User, payload: PutUserRoleRequest) {
    // user.role = payload.new_role;
    return await this.userService.set(user);
  }

  async updateUserPassword(user: User, payload: PutUserPassword) {
    try {
      console.log('aaa', payload.new_password, bcrypt.hashSync(payload.new_password, 10));
      user.password = bcrypt.hashSync(payload.new_password, 10);

      return await this.userService.set(user);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async deleteUser(user: User) {
    return await this.userService.get().remove(user);
  }
}
