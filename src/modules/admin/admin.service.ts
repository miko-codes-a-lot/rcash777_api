import { ERoles } from 'src/enums/roles.enum';
import { Injectable } from '@nestjs/common';
import { Pagination } from 'src/schemas/pagination.schema';
import { PutUserInfoRequest } from './schemas/put-user-info.schema';
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
    user.first_name = payload.first_name;
    user.last_name = payload.last_name;
    user.address = payload.address;

    return await this.userService.set(user);
  }

  async updateUserRole(user: User, payload: PutUserRoleRequest) {
    user.role = payload.new_role;
    return await this.userService.set(user);
  }

  async deleteUser(user: User) {
    return await this.userService.get().remove(user);
  }
}
