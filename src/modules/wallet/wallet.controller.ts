import { Controller, Get, Post, Body, Res, Query } from '@nestjs/common';
import { Response } from 'express';
import { FormDebitDTO, FormDebitSchema } from './dto/form-debit.dto';
import { FormCreditDTO, FormCreditSchema } from './dto/form-credit.dto';
import { FormDebitAndCreditDTO } from './dto/form-debit-n-credit.dto';
import { FormRollbackDTO } from './dto/form-rollback.dto';
import { FormEndRoundDTO } from './dto/form-end-round-dto';
import { CoinTransactionService } from '../coin-transaction/coin-transaction.service';
import { Validate } from 'src/decorators/validate.decorator';
import { WalletService } from './wallet.service';
import { NextralService } from './nextral.service';
import { AuthRequired } from 'src/decorators/auth-required.decorator';
import { RequestUser } from 'src/decorators/request-user.decorator';
import { User } from '../user/entities/user.entity';
import { FormAuthDTO } from './dto/form-auth.dto';
import { FormPayoutDTO, FormPayoutSchema } from './dto/form-payout.dto';

@Controller('provider/nextral')
export class WalletController {
  constructor(
    private readonly coinService: CoinTransactionService,
    private readonly nextralService: NextralService,
    private readonly walletService: WalletService,
  ) {}

  @Post('authenticate')
  @AuthRequired()
  async authenticate(@RequestUser() user: User, @Body() data: FormAuthDTO, @Res() res: Response) {
    const details = await this.nextralService.authenticate(user, data);

    return res.json(details);
  }

  @Get('balance')
  async balance(
    @Query('player') player: string,
    // @Query('clientToken') clientToken: string,
    // @Query('game') game: string,
    // @Query('platform') platform: Platform,
    // @Res() res: Response,
  ) {
    const balance = await this.coinService.computeBalance(player);

    return {
      balance,
      currency: 'PHP',
    };
  }

  /** @TODO: 2024-06-23 - Add middleware to check if signature is correct */
  @Post('debit')
  @Validate({ body: FormDebitSchema })
  async debit(@Body() data: FormDebitDTO, @Res() res: Response) {
    const balance = await this.walletService.debit(data);

    return res.json({
      currency: 'PHP',
      balance,
    });
  }

  /** @TODO: 2024-06-23 - Add middleware to check if signature is correct */
  @Post('credit')
  @Validate({ body: FormCreditSchema })
  async credit(@Body() data: FormCreditDTO, @Res() res: Response) {
    const balance = await this.walletService.credit(data);

    return res.json({
      currency: 'PHP',
      balance,
    });
  }

  @Post('payout')
  @Validate({ body: FormPayoutSchema })
  async payout(@Body() data: FormPayoutDTO, @Res() res: Response) {
    const balance = await this.walletService.payout(data);

    return res.json({
      currency: 'PHP',
      balance,
    });
  }

  @Post('debitAndCredit')
  async debitAndCredit(@Body() data: FormDebitAndCreditDTO, @Res() res: Response) {
    const balance = await this.walletService.debitAndCredit(data);

    return res.json({
      currency: 'PHP',
      balance,
    });
  }

  @Post('rollback')
  async rollback(@Body() data: FormRollbackDTO, @Res() res: Response) {
    const balance = await this.walletService.rollback(data);

    return res.json({
      currency: 'PHP',
      balance,
    });
  }

  // optional
  @Post('endRound')
  async endRound(@Body() data: FormEndRoundDTO, @Res() res: Response) {
    return res.json({
      currency: 'PHP',
      balance: 0,
    });
  }
}
