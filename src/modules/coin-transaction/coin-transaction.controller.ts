import { Controller, Get, Post, Body, Param, Query, Put } from '@nestjs/common';
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

  @Get('/user/:id/balance')
  async computeBalanceOf(@Param('id') id: string) {
    return await this.coinService.computeBalance(id);
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

  @Post('request/withdraw')
  @Validate({ body: WithdrawRequestSchema })
  async requestWithdraw(@RequestUser() user: User, @Body() data: CoinRequestDTO) {
    return await this.coinService.requestWithdraw(user, data);
  }

  @Put('request/deposit/:id/approve')
  async approveDeposit(@RequestUser() user: User, @Param('id') id: string) {
    return await this.coinService.approveDeposit(id, user);
  }

  @Put('request/deposit/:id/reject')
  async rejectDeposit(@RequestUser() user: User, @Param('id') id: string) {
    return await this.coinService.rejectDeposit(id, user);
  }

  @Post('request/deposit')
  @Validate({ body: DepositRequestSchema })
  async requestDeposit(@RequestUser() user: User, @Body() data: CoinRequestDTO) {
    return await this.coinService.requestDeposit(user, data);
  }

  @Put('request/withdraw/:id/approve')
  async approveWithdraw(@RequestUser() user: User, @Param('id') id: string) {
    return await this.coinService.approveWithdraw(id, user);
  }

  @Put('request/withdraw/:id/reject')
  async rejectWithdraw(@RequestUser() user: User, @Param('id') id: string) {
    return await this.coinService.rejectWithdraw(id, user);
  }

  @Put('request/:id/transfer')
  async rejectTransfer(@RequestUser() user: User, @Param('id') id: string) {
    return await this.coinService.transferRequest(id, user);
  }
}
