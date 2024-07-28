import { Controller, Get, Post, Body, Res, Query } from '@nestjs/common';
import { Response } from 'express';
import { FormDebitDTO, FormDebitSchema } from './dto/form-debit.dto';
import { FormCreditDTO, FormCreditSchema } from './dto/form-credit.dto';
import { FormDebitAndCreditDTO } from './dto/form-debit-n-credit.dto';
import { FormRollbackDTO } from './dto/form-rollback.dto';
import { CoinTransactionService } from '../coin-transaction/coin-transaction.service';
import { Validate } from 'src/decorators/validate.decorator';
import { NextralWalletService } from './nextral-wallet.service';
import { NextralService } from './nextral.service';
import { FormAuthDTO } from './dto/form-auth.dto';
import { FormPayoutDTO, FormPayoutSchema } from './dto/form-payout.dto';
import { NextralBasicSecure, NextralSecure } from 'src/decorators/nextral-secure.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('provider/nextral')
@Controller('provider/nextral')
export class NextralWalletController {
  constructor(
    private readonly coinService: CoinTransactionService,
    private readonly nextralService: NextralService,
    private readonly nextralWalletService: NextralWalletService,
  ) {}

  @Post('authenticate')
  async authenticate(@Body() data: FormAuthDTO, @Res() res: Response) {
    const details = await this.nextralService.authenticate(data);

    return res.json(details);
  }

  @NextralBasicSecure()
  @Get('balance')
  async balance(
    @Query('player') player: string,
    // @Query('clientToken') clientToken: string,
    // @Query('game') game: string,
    // @Query('platform') platform: Platform,
    @Res() res: Response,
  ) {
    const balance = await this.coinService.computeBalance(player);

    return res.json({
      balance,
      currency: 'PHP',
    });
  }

  @NextralBasicSecure()
  @NextralSecure()
  @Post('debit')
  @Validate({ body: FormDebitSchema })
  async debit(@Body() data: FormDebitDTO, @Res() res: Response) {
    const balance = await this.nextralWalletService.debit(data);

    return res.json({
      currency: 'PHP',
      balance,
    });
  }

  @NextralBasicSecure()
  @NextralSecure()
  @Post('credit')
  @Validate({ body: FormCreditSchema })
  async credit(@Body() data: FormCreditDTO, @Res() res: Response) {
    const balance = await this.nextralWalletService.credit(data);

    return res.json({
      currency: 'PHP',
      balance,
    });
  }

  @NextralBasicSecure()
  @NextralSecure()
  @Post('payout')
  @Validate({ body: FormPayoutSchema })
  async payout(@Body() data: FormPayoutDTO, @Res() res: Response) {
    const balance = await this.nextralWalletService.payout(data);

    return res.json({
      currency: 'PHP',
      balance,
    });
  }

  @NextralBasicSecure()
  @NextralSecure()
  @Post('debitAndCredit')
  async debitAndCredit(@Body() data: FormDebitAndCreditDTO, @Res() res: Response) {
    const balance = await this.nextralWalletService.debitAndCredit(data);

    return res.json({
      currency: 'PHP',
      balance,
    });
  }

  @NextralBasicSecure()
  @NextralSecure()
  @Post('rollback')
  async rollback(@Body() data: FormRollbackDTO, @Res() res: Response) {
    const balance = await this.nextralWalletService.rollback(data);

    return res.json({
      currency: 'PHP',
      balance,
    });
  }
}
