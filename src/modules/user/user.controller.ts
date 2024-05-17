import { Controller, Get, Post, Body, Req, Param, BadRequestException, UseGuards, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { PostUserNewRequest } from './dto/post-user-new-request.dto';
import { IPostUserNewRequest } from './interfaces/post-user-new.interface';
import { AuthGuard } from '@nestjs/passport';
import { Payload } from 'src/decorators/payload.decorator';
import { Request } from 'express';
import { IUser } from './interfaces/user.interface';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Payload(PostUserNewRequest)
  async create(@Body() req: IPostUserNewRequest) {
    if (await this.userService.findByEmail(req.email)) {
      throw new BadRequestException('Email already exist');
    }

    await this.userService.create(req);
    return null;
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  getUser(@Req() req: Request) {
    const { id } = req.user as IUser;
    return this.userService.findById(id);
  }

  @Get('/list')
  @UseGuards(AuthGuard('jwt'))
  getUsers() {
    return this.userService.findAll();
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    const user = await this.userService.findById(+id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
