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
import { UserService } from '../user/user.service';
import { Pagination, PaginationSchema } from 'src/schemas/pagination.schema';
import { Response } from 'express';
import { HttpStatus } from 'src/enums/http-status.enum';
import { PutUserInfoRequest, PutUserInfoRequestSchema } from './schemas/put-user-info.schema';
import { DeleteUserRequest, DeleteUserRequestSchema } from './schemas/delete-user.schema';

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
  @Validate({ body: PutUserInfoRequestSchema })
  async updateUserInfo(
    @Body() payload: PutUserInfoRequest,
    @Param('id', ParseIntPipe) id: string,
    @Res() res: Response,
  ) {
    const user = await this.userService.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.adminService.updateUserInfo(user, payload);

    res.status(HttpStatus.SUCCESS).send();
  }

  @Delete('admin/user')
  @Validate({ body: DeleteUserRequestSchema })
  async deleteUser(@Body() payload: DeleteUserRequest, @Res() res: Response) {
    const user = await this.userService.findById(payload.user_id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.adminService.deleteUser(user);

    res.status(HttpStatus.SUCCESS).send();
  }
}
