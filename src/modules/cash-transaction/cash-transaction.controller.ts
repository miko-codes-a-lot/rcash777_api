import { Controller, Get, Post, Body, Param, Res } from '@nestjs/common';
import { CashTransactionService } from './cash-transaction.service';
import { FormCashTransactionDTO } from './dto/form-cash-transaction.dto';
import { AuthRequired } from 'src/decorators/auth-required.decorator';
import { ApiTags } from '@nestjs/swagger';
import { User } from '../user/entities/user.entity';
import { RequestUser } from 'src/decorators/request-user.decorator';
import { Response } from 'express';
import { EResponse } from 'src/enums/response.enum';

@AuthRequired()
@ApiTags('cash-transaction')
@Controller('cash-transaction')
export class CashTransactionController {
  constructor(private readonly cashTransactionService: CashTransactionService) {}

  @Post()
  async create(
    @RequestUser() user: User,
    @Body() FormData: FormCashTransactionDTO,
    @Res() res: Response,
  ) {
    const doc = await this.cashTransactionService.create(user, FormData);
    return res.status(EResponse.CREATED).json(doc);
  }

  @Get()
  findAll() {
    return this.cashTransactionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cashTransactionService.findOne(+id);
  }
}
