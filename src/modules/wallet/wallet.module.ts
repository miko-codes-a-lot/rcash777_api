import { Module } from '@nestjs/common';
import { WalletController } from './wallet.controller';
import { User } from '../user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from '../game/entities/game.entity';
import { WalletService } from './wallet.service';
import { GameSession } from '../game/entities/game-session.entity';
import { CoinTransactionService } from '../coin-transaction/coin-transaction.service';
import { CoinTransaction } from '../coin-transaction/entities/coin-transaction.entity';
import { NextralService } from './nextral.service';
import { HttpModule } from '@nestjs/axios';
import { CoinRequest } from '../coin-transaction/entities/coin-request.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Game, GameSession, CoinTransaction, CoinRequest]),
    HttpModule.register({}),
  ],
  controllers: [WalletController],
  providers: [CoinTransactionService, WalletService, NextralService],
})
export class WalletModule {}
