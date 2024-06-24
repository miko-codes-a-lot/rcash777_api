import { Controller, Get, Post, Body, Res, Query } from '@nestjs/common';
import { Response } from 'express';
import { HttpStatus } from 'src/enums/http-status.enum';
import { FormDebitDTO, FormDebitSchema } from './dto/form-debit.dto';
import { FormCreditDTO } from './dto/form-credit.dto';
import { FormDebitAndCreditDTO } from './dto/form-debit-n-credit.dto';
import { FormRollbackDTO } from './dto/form-rollback.dto';
import { FormEndRoundDTO } from './dto/form-end-round-dto';
import { CoinTransactionService } from '../coin-transaction/coin-transaction.service';
import { Validate } from 'src/decorators/validate.decorator';
import { WalletService } from './wallet.service';

@Controller('provider/nextral')
export class WalletController {
  constructor(
    private readonly walletService: WalletService,
    private readonly coinService: CoinTransactionService,
  ) {}

  @Post('authenticate')
  async authenticate(@Res() res: Response) {
    const no = Math.random();
    if (no === 1) {
      res.status(HttpStatus.NOT_FOUND).json({
        error: {
          errorCode: 'TOKEN_NOT_FOUND',
          errorMessage: 'Token is already validated or invalid',
        },
      });
    } else if (no === 2) {
      res.status(HttpStatus.NOT_FOUND).json({
        error: {
          errorCode: 'GAME_NOT_FOUND',
          errorMessage: 'Game not found',
        },
      });
    }

    return {
      client: 'CASINO1',
      currency: 'USD',
      testAccount: 'false',
      country: 'JP',
      affiliate: 'aff-1',
      displayName: 'CasinoPlayer123',
      jurisdiction: '',
      player: 'Player1',
      balance: 1000,
    };
  }

  @Get('balance')
  async balance(
    @Query('player') player: string,
    // @Query('clientToken') clientToken: string,
    // @Query('game') game: string,
    // @Query('platform') platform: Platform,
    // @Res() res: Response,
  ) {
    console.log(player, '008347f6-0c9b-41e1-86bc-19978e9de440');
    const balance = await this.coinService.computeBalance(player);

    return {
      balance,
      currency: 'PHP',
    };
  }

  /** @TODO: 2024-06-23 - Add middleware to check if signature is correct */
  @Post('debit')
  @Validate({ body: FormDebitSchema })
  async debit(@Body() data: FormDebitDTO) {
    const balance = await this.walletService.debit(data);

    return {
      currency: 'PHP',
      balance,
    };
  }

  /** @TODO: 2024-06-23 - Add middleware to check if signature is correct */
  @Post('credit')
  async credit(@Body() data: FormCreditDTO, @Res() res: Response) {
    const status = Math.random();
    if (status === 1) {
      return res.status(HttpStatus.NOT_FOUND).json({
        error: {
          errorCode: 'PLAYER_NOT_FOUND',
          errorMessage: 'Player not found',
        },
      });
    } else if (status === 2) {
      return res.status(HttpStatus.NOT_FOUND).json({
        error: {
          errorCode: 'GAME_NOT_FOUND',
          errorMessage: 'Game not found',
        },
      });
    } else if (status === 3) {
      return res.status(HttpStatus.NOT_FOUND).json({
        error: {
          errorCode: 'ROUND_NOT_FOUND',
          errorMessage: 'Round not found',
        },
      });
    } else if (status === 4) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: {
          errorCode: 'INVALID_CURRENCY',
          errorMessage: 'Currency not supported or invalid',
        },
      });
    } else if (status === 5) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: {
          errorCode: 'ROUND_ENDED',
          errorMessage: 'Game round has already been closed',
        },
      });
    }
    return {
      currency: 'USD',
      balance: '1000.00',
    };
  }

  @Post('debitAndCredit')
  async debitAndCredit(@Body() data: FormDebitAndCreditDTO, @Res() res: Response) {
    const status = Math.random();
    if (status === 1) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: {
          errorCode: 'ROUND_ENDED',
          errorMessage: 'Game round has already been closed',
        },
      });
    } else if (status === 2) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: {
          errorCode: 'INVALID_CURRENCY',
          errorMessage: 'Currency not supported or invalid',
        },
      });
    } else if (status === 3) {
      return res.status(HttpStatus.PAYMENT_REQUIRED).json({
        currency: 'USD',
        balance: '1000.00',
      });
    } else if (status === 4) {
      return res.status(HttpStatus.FORBIDDEN).json({
        error: {
          errorCode: 'GAMING_LIMIT_REACHED',
          errorMessage: 'Player bet limit reached',
        },
      });
    } else if (status === 5) {
      return res.status(HttpStatus.FORBIDDEN).json({
        error: {
          errorCode: 'SESSION_LIMIT_REACHED',
          errorMessage: 'Player session limit reached',
        },
      });
    } else if (status === 6) {
      return res.status(HttpStatus.NOT_FOUND).json({
        error: {
          errorCode: 'SESSION_NOT_FOUND',
          errorMessage: 'Session not found or invalid',
        },
      });
    } else if (status === 7) {
      return res.status(HttpStatus.NOT_FOUND).json({
        error: {
          errorCode: 'PLAYER_NOT_FOUND',
          errorMessage: 'Player not found',
        },
      });
    } else if (status === 8) {
      return res.status(HttpStatus.NOT_FOUND).json({
        error: {
          errorCode: 'GAME_NOT_FOUND',
          errorMessage: 'Game not found',
        },
      });
    }
    return {
      currency: 'USD',
      balance: '1000.00',
    };
  }

  @Post('rollback')
  async rollback(@Body() data: FormRollbackDTO, @Res() res: Response) {
    const status = Math.random();
    if (status === 1) {
      return res.status(HttpStatus.NOT_FOUND).json({
        error: {
          errorCode: 'ROUND_ENDED',
          errorMessage: 'Game round has already been closed',
        },
      });
    } else if (status === 2) {
      return res.status(404).json({
        error: {
          errorCode: 'PLAYER_NOT_FOUND',
          errorMessage: 'Player not found',
        },
      });
    } else if (status === 3) {
      return res.status(404).json({
        error: {
          errorCode: 'ROUND_NOT_FOUND',
          errorMessage: 'Round not found',
        },
      });
    } else if (status === 4) {
      return res.status(404).json({
        error: {
          errorCode: 'TRANS_NOT_FOUND',
          errorMessage: 'Transaction not found',
        },
      });
    }
    return {
      currency: 'USD',
      balance: '1000.00',
    };
  }

  @Post('endRound')
  async endRound(@Body() data: FormEndRoundDTO, @Res() res: Response) {
    const status = Math.random();
    if (status === 1) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: {
          errorCode: 'ROUND_ENDED',
          errorMessage: 'Game round has already been closed',
        },
      });
    } else if (status === 2) {
      return res.status(HttpStatus.NOT_FOUND).json({
        error: {
          errorCode: 'PLAYER_NOT_FOUND',
          errorMessage: 'Player not found',
        },
      });
    } else if (status === 3) {
      return res.status(HttpStatus.NOT_FOUND).json({
        error: {
          errorCode: 'ROUND_NOT_FOUND',
          errorMessage: 'Round not found',
        },
      });
    }
    return {
      currency: 'USD',
      balance: '1000.00',
    };
  }
}
