import { Controller, Get, Post, Body, Param, Delete, Put, Res, Query } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { FormPermissionDTO, PermissionSchema } from './dto/form-permission.dto';
import { ApiTags } from '@nestjs/swagger';
import { Validate } from 'src/decorators/validate.decorator';
import { RequestUser } from 'src/decorators/request-user.decorator';
import { User } from '../user/entities/user.entity';
import { AuthRequired } from 'src/decorators/auth-required.decorator';
import { HttpStatus } from 'src/enums/http-status.enum';
import { Response } from 'express';
import { PaginationDTO } from 'src/schemas/paginate-query.dto';

@AuthRequired()
@ApiTags('permission')
@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  @Validate({ body: PermissionSchema })
  async create(
    @RequestUser() user: User,
    @Body() formPermissionDTO: FormPermissionDTO,
    @Res() res: Response,
  ) {
    const doc = await this.permissionService.upsert(user, formPermissionDTO);
    return res.status(HttpStatus.CREATED).json(doc);
  }

  @Get()
  async findAll(@Query() query: PaginationDTO, @Res() res: Response) {
    query.page *= 1;
    query.pageSize *= 1;

    const paged = await this.permissionService.findAllPaginated(query);

    return res.status(HttpStatus.SUCCESS).json(paged);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.permissionService.findOne(id);
  }

  @Put(':id')
  @Validate({ body: PermissionSchema })
  async update(
    @Param('id') id: string,
    @RequestUser() user: User,
    @Body() formPermissionDTO: FormPermissionDTO,
    @Res() res: Response,
  ) {
    const doc = await this.permissionService.upsert(user, formPermissionDTO, id);
    return res.status(HttpStatus.SUCCESS).json(doc);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.permissionService.remove(id);
  }
}
