import { Controller, Get, Post, Body, Param, Delete, Put, Res, Query } from '@nestjs/common';
import { AuthRequired } from 'src/decorators/auth-required.decorator';
import { RoleService } from './role.service';
import { ApiTags } from '@nestjs/swagger';
import { Validate } from 'src/decorators/validate.decorator';
import { FormRoleDTO, RoleSchema } from './dto/form-role.dto';
import { RequestUser } from 'src/decorators/request-user.decorator';
import { User } from '../user/entities/user.entity';
import { Response } from 'express';
import { HttpStatus } from 'src/enums/http-status.enum';
import { PaginationDTO } from 'src/schemas/paginate-query.dto';

@AuthRequired()
@ApiTags('role')
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @Validate({ body: RoleSchema })
  async create(@RequestUser() user: User, @Body() formData: FormRoleDTO, @Res() res: Response) {
    const doc = await this.roleService.createOrUpdate(user, formData);
    return res.status(HttpStatus.CREATED).json(doc);
  }

  @Get('options')
  async options(@Query('name') name: string) {
    return this.roleService.getOptions(name);
  }

  @Get('option')
  async option(@Query('name') name: string) {
    return this.roleService.getOptions(name);
  }

  @Get()
  async findAll(@Query() query: PaginationDTO, @Res() res: Response) {
    query.page *= 1;
    query.pageSize *= 1;

    const paged = await this.roleService.findAllPaginated(query);

    return res.status(HttpStatus.SUCCESS).json(paged);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(id);
  }

  @Put(':id')
  @Validate({ body: RoleSchema })
  async update(
    @Param('id') id: string,
    @RequestUser() user: User,
    @Body() formData: FormRoleDTO,
    @Res() res: Response,
  ) {
    const doc = await this.roleService.createOrUpdate(user, formData, id);
    return res.status(HttpStatus.SUCCESS).json(doc);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    await this.roleService.remove(id);
    return res.status(HttpStatus.NO_CONTENT).send();
  }
}
