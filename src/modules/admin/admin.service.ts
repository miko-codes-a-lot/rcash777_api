import { ERoles } from 'src/enums/roles.enum';
import { IPutUserInfoRequest } from './interfaces/put-user-info.interface';
import { IPutUserRoleRequest } from './interfaces/put-user-role.interface';
import { Injectable } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class AdminService {
  constructor(private readonly userService: UserService) {}

  async findAllAdmin() {
    return await this.userService.get().find({ where: { role: ERoles.ADMIN } });
  }

  async updateUserInfo(user: User, payload: IPutUserInfoRequest) {
    user.email = payload.email;
    user.first_name = payload.first_name;
    user.last_name = payload.last_name;
    user.address = payload.address;

    return await this.userService.set(user);
  }

  async updateUserRole(user: User, payload: IPutUserRoleRequest) {
    user.role = payload.new_role;
    return await this.userService.set(user);
  }

  async deleteUser(user: User) {
    return await this.userService.get().remove(user);
  }
}
