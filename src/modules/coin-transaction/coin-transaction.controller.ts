import { Controller, Get, Post, Body, Param, Query, Put } from '@nestjs/common';
import { CoinTransactionService } from './coin-transaction.service';
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
import { AuthIsNot } from 'src/decorators/auth-is-not';

@AuthRequired()
@ApiTags('coin-transaction')
@Controller('coin-transaction')
export class CoinTransactionController {
  constructor(private readonly coinService: CoinTransactionService) {}

  @AuthIsNot(['isPlayer'])
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

  @AuthIsNot(['isPlayer'])
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

  @AuthIsNot(['isPlayer'])
  @Get()
  async findAll(@RequestUser() user: User, @Query() query: PaginationDTO) {
    return await this.coinService.findAllPaginated(user, query);
  }

  @Get('self/balance')
  async computeBalance(@RequestUser() user: User) {
    return await this.coinService.computeBalance(user.id);
  }

  @AuthIsNot(['isPlayer'])
  @Get('request')
  async requests(@RequestUser() user: User, @Query() query: CoinRequestPaginateDTO) {
    return await this.coinService.findRequests(user, query);
  }

  @Post('request/withdraw')
  @Validate({ body: WithdrawRequestSchema })
  async requestWithdraw(@RequestUser() user: User, @Body() data: CoinRequestDTO) {
    return await this.coinService.requestWithdraw(user, data);
  }

  @AuthIsNot(['isPlayer'])
  @Put('request/deposit/:id/approve')
  async approveDeposit(@RequestUser() user: User, @Param('id') id: string) {
    return await this.coinService.approveDeposit(id, user);
  }

  @AuthIsNot(['isPlayer'])
  @Put('request/deposit/:id/reject')
  async rejectDeposit(@RequestUser() user: User, @Param('id') id: string) {
    return await this.coinService.rejectDeposit(id, user);
  }

  @Post('request/deposit')
  @Validate({ body: DepositRequestSchema })
  async requestDeposit(@RequestUser() user: User, @Body() data: CoinRequestDTO) {
    return await this.coinService.requestDeposit(user, data);
  }

  @AuthIsNot(['isPlayer'])
  @Put('request/withdraw/:id/approve')
  async approveWithdraw(@RequestUser() user: User, @Param('id') id: string) {
    return await this.coinService.approveWithdraw(id, user);
  }

  @AuthIsNot(['isPlayer'])
  @Put('request/withdraw/:id/reject')
  async rejectWithdraw(@RequestUser() user: User, @Param('id') id: string) {
    return await this.coinService.rejectWithdraw(id, user);
  }

  @AuthIsNot(['isPlayer'])
  @Put('request/:id/transfer')
  async rejectTransfer(@RequestUser() user: User, @Param('id') id: string) {
    return await this.coinService.transferRequest(id, user);
  }
}
