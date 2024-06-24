import { Module } from '@nestjs/common';
import { WalletController } from './wallet.controller';
import { CoinTransactionService } from '../coin-transaction/coin-transaction.service';
import { User } from '../user/entities/user.entity';
import { CoinTransaction } from '../coin-transaction/entities/coin-transaction.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from '../game/entities/game.entity';
import { WalletService } from './wallet.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Game, CoinTransaction])],
  controllers: [WalletController],
  providers: [WalletService, CoinTransactionService],
})
export class WalletModule {}
