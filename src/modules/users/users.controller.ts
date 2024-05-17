import { Controller, Get, Post, Body, Param, BadRequestException, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import { PostUserNewRequest } from './dto/post-user-new-request.dto';
import { IPostUserNewRequest } from './interfaces/post-user-new.interface';
import { AuthGuard } from '@nestjs/passport';
import { Payload } from 'src/decorators/payload.decorator';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Payload(PostUserNewRequest)
  async create(@Body() req: IPostUserNewRequest) {
    if (await this.usersService.findByEmail(req.email)) {
      throw new BadRequestException('Email already exist');
    }

    await this.usersService.create(req);
    return null;
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  getUsers() {
    return this.usersService.findAll();
  }

  @Get(':id')
  getUser(@Param('id') id: string) {
    return this.usersService.findById(+id);
  }
}
