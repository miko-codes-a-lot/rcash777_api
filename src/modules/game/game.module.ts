import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { GameImage } from './entities/game-image.entity';
import { GameSchedule } from './game.schedule';
import { HttpModule } from '@nestjs/axios';
import { NextralService } from '../nextral/nextral.service';
import { GameSession } from './entities/game-session.entity';
import { User } from '../user/entities/user.entity';
import { CoinTransactionService } from '../coin-transaction/coin-transaction.service';
import { CoinTransaction } from '../coin-transaction/entities/coin-transaction.entity';
import { CoinRequest } from '../coin-transaction/entities/coin-request.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Game, GameImage, GameSession, CoinTransaction, CoinRequest]),
    HttpModule.register({}),
  ],
  controllers: [GameController],
  providers: [GameService, GameSchedule, NextralService, CoinTransactionService],
})
export class GameModule {}
