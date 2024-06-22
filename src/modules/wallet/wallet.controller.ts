import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Query } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { Response } from 'express';
import { EResponse } from 'src/enums/response.enum';
import { Platform } from 'src/enums/platform.enum';
import { FormDebit } from './dto/form-debit.dto';

@Controller('provider/nextral')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post('authenticate')
  async authenticate(@Res() res: Response) {
    const no = Math.random();
    if (no === 1) {
      res.status(EResponse.NOTFOUND).json({
        error: {
          errorCode: 'TOKEN_NOT_FOUND',
          errorMessage: 'Token is already validated or invalid',
        },
      });
    } else if (no === 2) {
      res.status(EResponse.NOTFOUND).json({
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
    @Query() player: string,
    @Query() clientToken: string,
    @Query() game: string,
    @Query() platform: Platform,
    @Res() res: Response,
  ) {
    console.log(`playerId -> ${player}`);
    console.log(`clientToken -> ${clientToken}`);
    console.log(`gameId -> ${game}`);
    console.log(`platform -> ${platform}`);

    const status = Math.random();
    if (status === 1) {
      return res.status(EResponse.NOTFOUND).json({
        error: {
          errorCode: 'PLAYER_NOT_FOUND',
          errorMessage: 'Player not found',
        },
      });
    } else if (status === 2) {
      return res.status(EResponse.NOTFOUND).json({
        error: {
          errorCode: 'GAME_NOT_FOUND',
          errorMessage: 'Game not found',
        },
      });
    }

    return {
      balance: '1000.00',
      currency: 'USD',
    };
  }

  /** @TODO: 2024-06-23 - Add middleware to check if signature is correct */
  @Post('debit')
  async debit(@Body() data: FormDebit, @Res() res: Response) {
    const status = Math.random();
    if (status === 1) {
      return res.status(EResponse.BADREQUEST).json({
        error: {
          errorCode: 'INVALID_CURRENCY',
          errorMessage: 'Currency not supported or invalid',
        },
      });
    } else if (status === 2) {
      return res.status(EResponse.BADREQUEST).json({
        error: {
          errorCode: 'ROUND_ENDED',
          errorMessage: 'Game round has already been closed',
        },
      });
    } else if (status === 3) {
      return res.status(EResponse.PAYMENTREQUIRED).json({
        currency: 'USD',
        balance: '1000.00',
      });
    } else if (status === 4) {
      return res.status(EResponse.FORBIDDEN).json({
        error: {
          errorCode: 'GAMING_LIMIT_REACHED',
          errorMessage: 'Player bet limit reached',
        },
      });
    } else if (status === 5) {
      return res.status(EResponse.FORBIDDEN).json({
        error: {
          errorCode: 'SESSION_LIMIT_REACHED',
          errorMessage: 'Player session limit reached',
        },
      });
    } else if (status === 6) {
      return res.status(EResponse.NOTFOUND).json({
        error: {
          errorCode: 'SESSION_NOT_FOUND',
          errorMessage: 'Session not found or invalid',
        },
      });
    } else if (status === 6) {
      return res.status(EResponse.NOTFOUND).json({
        error: {
          errorCode: 'PLAYER_NOT_FOUND',
          errorMessage: 'Player not found',
        },
      });
    } else if (status === 6) {
      return res.status(EResponse.NOTFOUND).json({
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
}
