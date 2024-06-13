import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CoinTransactionService } from './coin-transaction.service';
import { CreateCoinTransactionDto } from './dto/create-coin-transaction.dto';

@Controller('coin-transaction')
export class CoinTransactionController {
  constructor(private readonly coinTransactionService: CoinTransactionService) {}

  @Post()
  create(@Body() createCoinTransactionDto: CreateCoinTransactionDto) {
    return this.coinTransactionService.create(createCoinTransactionDto);
  }

  @Get()
  findAll() {
    return this.coinTransactionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coinTransactionService.findOne(+id);
  }
}
