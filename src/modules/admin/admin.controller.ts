import { Body, Controller, Get, NotFoundException, Param, Put } from '@nestjs/common';

import { AdminService } from './admin.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthAdminOnly } from 'src/decorators/auth-admin-only';
import { Payload } from 'src/decorators/payload.decorator';
import { PutUserRoleRequest } from './dto/put-user-role';
import { IPutUserRoleRequest } from './interfaces/put-user-role.interface';
import { UserService } from '../user/user.service';
import { PutUserInfoRequest } from './dto/put-user-info';
import { IPutUserInfoRequest } from './interfaces/put-user-info.interface';

@Controller('admin')
@ApiTags('admin')
@AuthAdminOnly()
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly userService: UserService,
  ) {}

  @Get('user/list')
  getUsers() {
    return this.userService.findAll();
  }

  @Get('user/admin-list')
  async getAdminList() {
    return this.adminService.findAllAdmin();
  }

  @Get('user/:id')
  async getUserById(@Param('id') id: string) {
    const user = await this.userService.findById(+id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  @Put('user/update-info')
  @Payload(PutUserInfoRequest)
  async updateUserInfo(@Body() payload: IPutUserInfoRequest) {
    const user = await this.userService.findById(payload.user_id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.adminService.updateUserInfo(user, payload);

    return null;
  }

  @Put('user/update-role')
  @Payload(PutUserRoleRequest)
  async updateUserRole(@Body() payload: IPutUserRoleRequest) {
    const user = await this.userService.findById(payload.user_id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.adminService.updateUserRole(user, payload);

    return null;
  }
}
