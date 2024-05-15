import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, BadRequestException, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { ValidateRequest } from 'src/pipes/validate-request';
import { joiToSwagger } from 'src/utils/joi-to-swagger';
import { PostUserNewRequest } from './dto/post-user-new-request.dto';
import { IPostUserNewRequest } from './interfaces/post-user-new.interface';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiBody({ schema: joiToSwagger(PostUserNewRequest) })
  @UsePipes(new ValidateRequest(PostUserNewRequest))
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
