import { Body, Controller, Get, NotFoundException, Put } from '@nestjs/common';

import { AdminService } from './admin.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthAdminOnly } from 'src/decorators/auth-admin-only';
import { Payload } from 'src/decorators/payload.decorator';
import { PostUserRoleRequest } from './dto/put-user-role';
import { IPostUserRoleRequest } from './interfaces/post-user-role.interface';
import { UserService } from '../user/user.service';

@Controller('admin')
@ApiTags('admin')
@AuthAdminOnly()
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly userService: UserService,
  ) {}

  @Get('user/list')
  async getAdminList() {
    return this.adminService.findAllAdmin();
  }

  @Put('user/update-role')
  @Payload(PostUserRoleRequest)
  async updateUserRole(@Body() payload: IPostUserRoleRequest) {
    const user = await this.userService.findById(payload.user_id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.adminService.updateRole(user, payload);

    return null;
  }
}
