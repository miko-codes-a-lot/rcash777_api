import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Query } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { Response } from 'express';
import { EResponse } from 'src/enums/response.enum';

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
}
