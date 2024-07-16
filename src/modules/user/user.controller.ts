import {
  Controller,
  Get,
  Post,
  Body,
  BadRequestException,
  Put,
  Res,
  Query,
  Param,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { Validate } from 'src/decorators/validate.decorator';
import { Response } from 'express';
import { AuthRequired } from 'src/decorators/auth-required.decorator';
import { HttpStatus } from 'src/enums/http-status.enum';
import { RequestUser } from 'src/decorators/request-user.decorator';
import { User } from './entities/user.entity';
import { PostUserNewRequest, PostUserNewRequestSchema } from './schemas/post-user-new.schema';
import {
  PostUserUpdateRequest,
  PutUserUpdateRequestSchema,
} from './schemas/put-user-update.schema';
import { UserPaginateDTO } from 'src/schemas/paginate-query.dto';

@AuthRequired()
@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('admin')
  @Validate({ body: PostUserNewRequestSchema })
  async addUser(
    @Body() payload: PostUserNewRequest,
    @RequestUser() admin: User,
    @Res() res: Response,
  ) {
    if (await this.userService.findByEmail(payload.email)) {
      throw new BadRequestException('Email already exist');
    }

    const user = await this.userService.create(admin, payload);

    return res.status(HttpStatus.SUCCESS).json(user);
  }

  @Get('admin/:id')
  async findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Get('admin/:id/tree')
  async getTree(@Param('id') id: string, @Query() query: UserPaginateDTO) {
    const user = await this.userService.findOne(id);
    return this.userService.findAllPaginated(user, query);
  }

  @Get('admin')
  async findAll(@RequestUser() user: User, @Query() query: UserPaginateDTO, @Res() res: Response) {
    query.page *= 1;
    query.pageSize *= 1;

    const paged = await this.userService.findAllPaginated(user, query);

    return res.status(HttpStatus.SUCCESS).json(paged);
  }

  @Put('self')
  @Validate({ body: PutUserUpdateRequestSchema })
  async updateSelf(
    @Body() payload: PostUserUpdateRequest,
    @RequestUser() user: User,
    @Res() res: Response,
  ) {
    const { id } = user;
    const result = await this.userService.updateSelf(id, user, payload);

    res.status(HttpStatus.SUCCESS).send(result);
  }

  @Put('admin/:id')
  @Validate({ body: PutUserUpdateRequestSchema })
  async updateUser(
    @Param('id') id: string,
    @Body() payload: PostUserUpdateRequest,
    @RequestUser() user: User,
    @Res() res: Response,
  ) {
    const result = await this.userService.update(id, user, payload);

    res.status(HttpStatus.SUCCESS).send(result);
  }

  @Get('self')
  getUser(@RequestUser() user: User) {
    const { id } = user;
    return this.userService.getSelf(id);
  }
}
