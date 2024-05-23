import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Put,
  Query,
  Res,
} from '@nestjs/common';

import { AdminService } from './admin.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthAdminOnly } from 'src/decorators/auth-admin-only';
import { Validate } from 'src/decorators/validate.decorator';
import { PutUserRoleRequest } from './dto/put-user-role-request';
import { IPutUserRoleRequest } from './interfaces/put-user-role.interface';
import { UserService } from '../user/user.service';
import { PutUserInfoRequest } from './dto/put-user-info-request';
import { IPutUserInfoRequest } from './interfaces/put-user-info.interface';
import { DeleteUserRequest } from './dto/delete-user-request';
import { IDeleteUserRequest } from './interfaces/delete-user.interface';
import { Pagination, PaginationSchema } from 'src/schemas/pagination.schema';
import { Response } from 'express';
import { EResponse } from 'src/enums/response.enum';

@Controller('admin')
@ApiTags('admin')
@AuthAdminOnly()
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly userService: UserService,
  ) {}

  @Get('user/list')
  @Validate({ query: PaginationSchema })
  getUsers(@Query() query: Pagination) {
    return this.userService.findAllUserPaginate(query);
  }

  @Get('user/admin-list')
  @Validate({ query: PaginationSchema })
  async getAdminList(@Query() query: Pagination) {
    return this.adminService.findAllAdminPaginate(query);
  }

  @Get('user/:id')
  async getUserById(@Param('id') id: string) {
    const user = await this.userService.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  @Put('user/:id/update-info')
  @Validate({ body: PutUserInfoRequest })
  async updateUserInfo(
    @Body() payload: IPutUserInfoRequest,
    @Param('id', ParseIntPipe) id: string,
    @Res() res: Response,
  ) {
    const user = await this.userService.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.adminService.updateUserInfo(user, payload);

    res.status(EResponse.SUCCESS).send();
  }

  @Put('user/:id/update-role')
  @Validate({ body: PutUserRoleRequest })
  async updateUserRole(
    @Body() payload: IPutUserRoleRequest,
    @Param('id', ParseIntPipe) id: string,
    @Res() res: Response,
  ) {
    const user = await this.userService.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.adminService.updateUserRole(user, payload);

    res.status(EResponse.SUCCESS).send();
  }

  @Delete('admin/user')
  @Validate({ body: DeleteUserRequest })
  async deleteUser(@Body() payload: IDeleteUserRequest, @Res() res: Response) {
    const user = await this.userService.findById(payload.user_id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.adminService.deleteUser(user);

    res.status(EResponse.SUCCESS).send();
  }
}
