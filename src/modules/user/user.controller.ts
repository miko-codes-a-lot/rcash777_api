import { Controller, Get, Post, Body, BadRequestException, Put, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { Validate } from 'src/decorators/validate.decorator';
import { Response } from 'express';
import { AuthRequired } from 'src/decorators/auth-required.decorator';
import { EResponse } from 'src/enums/response.enum';
import { RequestUser } from 'src/decorators/request-user.decorator';
import { User } from './entities/user.entity';
import { PostUserNewRequest, PostUserNewRequestSchema } from './schemas/post-user-new.schema';
import {
  PostUserUpdateRequest,
  PutUserUpdateRequestSchema,
} from './schemas/put-user-update.schema';

@AuthRequired()
@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Validate({ body: PostUserNewRequestSchema })
  async addUser(@Body() payload: PostUserNewRequest, @Res() res: Response) {
    if (await this.userService.findByEmail(payload.email)) {
      throw new BadRequestException('Email already exist');
    }

    await this.userService.create(payload);

    res.status(EResponse.SUCCESS).send();
  }

  @Put()
  @Validate({ body: PutUserUpdateRequestSchema })
  async updateUser(
    @Body() payload: PostUserUpdateRequest,
    @RequestUser() user: User,
    @Res() res: Response,
  ) {
    const { id } = user;

    await this.userService.update(id, payload);

    res.status(EResponse.SUCCESS).send();
  }

  @Get()
  getUser(@RequestUser() user: User) {
    const { id } = user;
    return this.userService.findById(id);
  }
}
