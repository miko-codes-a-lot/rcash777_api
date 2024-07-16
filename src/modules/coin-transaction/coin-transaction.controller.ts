import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { CoinTransactionService } from './coin-transaction.service';
import { FormCoinTransactionDto } from './dto/form-coin-transaction.dto';
import { CoinRequestPaginateDTO, PaginationDTO } from 'src/schemas/paginate-query.dto';
import { AuthRequired } from 'src/decorators/auth-required.decorator';
import { RequestUser } from 'src/decorators/request-user.decorator';
import { User } from '../user/entities/user.entity';
import { Validate } from 'src/decorators/validate.decorator';
import {
  CoinRequestDTO,
  DepositRequestSchema,
  WithdrawRequestSchema,
} from './dto/coin-request.dto';
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
  @Get('user/:id?')
  async findUserTransactions(
    // @RequestUser() user: User,
    @Query() query: PaginationDTO,
    @Param('id') id: string,
  ) {
    query.page *= 1;
    query.pageSize *= 1;

    return await this.coinService.findSelfPaginated({ id } as User, query);
  }

  @Get('self')
  async findSelfTransactions(@RequestUser() user: User, @Query() query: PaginationDTO) {
    query.page *= 1;
    query.pageSize *= 1;

    return await this.coinService.findSelfPaginated(user, query);
  }

  // @TODO - Miko Chu - 2024-06-13: must be admin
  @Get()
  async findAll(@RequestUser() user: User, @Query() query: PaginationDTO) {
    return await this.coinService.findAllPaginated(user, query);
  }

  @Get('self/balance')
  async computeBalance(@RequestUser() user: User) {
    return await this.coinService.computeBalance(user.id);
  }

  @Get('request')
  async requests(@RequestUser() user: User, @Query() query: CoinRequestPaginateDTO) {
    return await this.coinService.findRequests(user, query);
  }

  @Post('deposit')
  async deposit(@RequestUser() user: User, @Body() data: any) {
    return await this.coinService.deposit(user, data);
  }

  @Post('request/withdraw')
  @Validate({ body: WithdrawRequestSchema })
  async requestWithdraw(@RequestUser() user: User, @Body() data: CoinRequestDTO) {
    return await this.coinService.requestWithdraw(user, data);
  }

  @Post('request/deposit')
  @Validate({ body: DepositRequestSchema })
  async requestDeposit(@RequestUser() user: User, @Body() data: CoinRequestDTO) {
    return await this.coinService.requestDeposit(user, data);
  }
}
