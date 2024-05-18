import { Controller, Get, Post, Body, Req, Param, BadRequestException, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { PostUserNewRequest } from './dto/post-user-new-request.dto';
import { IPostUserNewRequest } from './interfaces/post-user-new.interface';
import { Payload } from 'src/decorators/payload.decorator';
import { Request } from 'express';
import { IUser } from './interfaces/user.interface';
import { AuthRequired } from 'src/decorators/auth-required.decorator';
import { AuthAdminOnly } from 'src/decorators/auth-admin-only';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Payload(PostUserNewRequest)
  async create(@Body() payload: IPostUserNewRequest) {
    if (await this.userService.findByEmail(payload.email)) {
      throw new BadRequestException('Email already exist');
    }

    await this.userService.create(payload);
    return null;
  }

  @Get()
  @AuthRequired()
  getUser(@Req() req: Request) {
    const { id } = req.user as IUser;
    return this.userService.findById(id);
  }

  @Get('/list')
  @AuthAdminOnly()
  getUsers() {
    return this.userService.findAll();
  }

  @Get(':id')
  @AuthAdminOnly()
  async getUserById(@Param('id') id: string) {
    const user = await this.userService.findById(+id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
