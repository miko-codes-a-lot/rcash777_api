import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { CoinTransactionService } from './coin-transaction.service';
import { FormCoinTransactionDto } from './dto/form-coin-transaction.dto';
import { PaginationDTO } from 'src/schemas/paginate-query.dto';
import { AuthRequired } from 'src/decorators/auth-required.decorator';
import { RequestUser } from 'src/decorators/request-user.decorator';
import { User } from '../user/entities/user.entity';
import { Validate } from 'src/decorators/validate.decorator';
import { WithdrawRequestDTO, WithdrawRequestSchema } from './dto/withdraw-request.dto';
import { ApiTags } from '@nestjs/swagger';

@AuthRequired()
@ApiTags('coin-transaction')
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

  @Get('self')
  async findSelfTransactions(@RequestUser() user: User, @Query() query: PaginationDTO) {
    query.page *= 1;
    query.pageSize *= 1;

    return await this.coinService.findAllPaginated(query, user.id);
  }

  // @TODO - Miko Chu - 2024-06-13: must be admin
  @Get()
  async findAll(@Query() query: PaginationDTO) {
    return await this.coinService.findAllPaginated(query);
  }

  @Get('self/balance')
  async computeBalance(@RequestUser() user: User) {
    return await this.coinService.computeBalance(user.id);
  }

  @Post('request/withdraw')
  @Validate({ body: WithdrawRequestSchema })
  async requestWithdraw(@RequestUser() user: User, data: WithdrawRequestDTO) {
    return await this.coinService.requestWithdraw(user, data);
  }
}
