import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { CoinTransactionService } from './coin-transaction.service';
import { FormCoinTransactionDto } from './dto/form-coin-transaction.dto';
import { PaginationDTO } from 'src/schemas/paginate-query.dto';

@Controller('coin-transaction')
export class CoinTransactionController {
  constructor(private readonly coinService: CoinTransactionService) {}

  @Post()
  create(@Body() createCoinTransactionDto: FormCoinTransactionDto) {
    return this.coinService.create(createCoinTransactionDto);
  }

  // @TODO - Miko Chu - 2024-06-13: must be admin or agent or the player itself
  @Get('player/:id?')
  async findAllUser(@Query() query: PaginationDTO, @Param('id') id?: string) {
    query.page *= 1;
    query.pageSize *= 1;

    return await this.coinService.findAllPaginated(query, id);
  }

  // @TODO - Miko Chu - 2024-06-13: must be admin
  @Get()
  async findAll(@Query() query: PaginationDTO) {
    return await this.coinService.findAllPaginated(query);
  }
}
