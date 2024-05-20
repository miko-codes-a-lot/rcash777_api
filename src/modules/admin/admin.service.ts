import { ERoles } from 'src/enums/roles.enum';
import { IPostUserRoleRequest } from './interfaces/post-user-role.interface';
import { Injectable } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class AdminService {
  constructor(private readonly userService: UserService) {}

  async findAllAdmin() {
    return await this.userService.get().find({ where: { role: ERoles.ADMIN } });
  }

  async updateRole(user: User, payload: IPostUserRoleRequest) {
    user.role = payload.new_role;
    return await this.userService.set(user);
  }
}
