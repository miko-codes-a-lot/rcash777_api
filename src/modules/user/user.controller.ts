import { Controller, Get, Post, Body, Req, BadRequestException, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { PostUserNewRequest } from './dto/post-user-new-request.dto';
import { IPostUserNewRequest } from './interfaces/post-user-new.interface';
import { Payload } from 'src/decorators/payload.decorator';
import { Request } from 'express';
import { IUser } from './interfaces/user.interface';
import { AuthRequired } from 'src/decorators/auth-required.decorator';
import { PutUserUpdateRequest } from './dto/put-user-update-request.dto';
import { IPostUserUpdateRequest } from './interfaces/put-user-update.interface';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Payload(PostUserNewRequest)
  async addUser(@Body() payload: IPostUserNewRequest) {
    if (await this.userService.findByEmail(payload.email)) {
      throw new BadRequestException('Email already exist');
    }

    await this.userService.create(payload);
    return null;
  }

  @Put()
  @AuthRequired()
  @Payload(PutUserUpdateRequest)
  async updateUser(@Body() payload: IPostUserUpdateRequest, @Req() req: Request) {
    const { id } = req.user as IUser;
    await this.userService.update(id, payload);
    return null;
  }

  @Get()
  @AuthRequired()
  getUser(@Req() req: Request) {
    const { id } = req.user as IUser;
    return this.userService.findById(id);
  }
}
