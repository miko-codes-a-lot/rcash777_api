import { Controller, Get, Post, Body, Req, BadRequestException, Put, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { PostUserNewRequest } from './dto/post-user-new-request.dto';
import { IPostUserNewRequest } from './interfaces/post-user-new.interface';
import { Validate } from 'src/decorators/validate.decorator';
import { Request, Response } from 'express';
import { IUser } from './interfaces/user.interface';
import { AuthRequired } from 'src/decorators/auth-required.decorator';
import { PutUserUpdateRequest } from './dto/put-user-update-request.dto';
import { IPostUserUpdateRequest } from './interfaces/put-user-update.interface';
import { EResponse } from 'src/enums/response.enum';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Validate({ body: PostUserNewRequest })
  async addUser(@Body() payload: IPostUserNewRequest, @Res() res: Response) {
    if (await this.userService.findByEmail(payload.email)) {
      throw new BadRequestException('Email already exist');
    }

    await this.userService.create(payload);

    res.status(EResponse.SUCCESS).send();
  }

  @Put()
  @AuthRequired()
  @Validate({ body: PutUserUpdateRequest })
  async updateUser(
    @Body() payload: IPostUserUpdateRequest,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const { id } = req.user as IUser;

    await this.userService.update(id, payload);

    res.status(EResponse.SUCCESS).send();
  }

  @Get()
  @AuthRequired()
  getUser(@Req() req: Request) {
    const { id } = req.user as IUser;
    return this.userService.findById(id);
  }
}
