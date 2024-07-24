import { Controller, Get, Param, Query } from '@nestjs/common';
import { CommissionService } from './commission.service';
import { CommissionPaginateDTO } from 'src/schemas/paginate-query.dto';
import { AuthRequired } from 'src/decorators/auth-required.decorator';
import { AuthIsNot } from 'src/decorators/auth-is-not';
import { RequestUser } from 'src/decorators/request-user.decorator';
import { User } from '../user/entities/user.entity';

@AuthRequired()
@AuthIsNot(['isPlayer'])
@Controller('commission')
export class CommissionController {
  constructor(private readonly commissionService: CommissionService) {}

  @Get()
  findAll(@RequestUser() user: User, @Query() query: CommissionPaginateDTO) {
    return this.commissionService.findAllPools(user, query);
  }

  @Get('unit')
  findAllUnit(@RequestUser() user: User, @Query() query: CommissionPaginateDTO) {
    return this.commissionService.findAllCommissions(user, query);
  }

  @Get(':id')
  findOne(@RequestUser() user: User, @Param('id') id: string) {
    return this.commissionService.findOne(user, id);
  }
}
