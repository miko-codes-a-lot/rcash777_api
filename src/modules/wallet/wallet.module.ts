import { Module } from '@nestjs/common';
import { WalletController } from './wallet.controller';
import { CoinTransactionService } from '../coin-transaction/coin-transaction.service';
import { User } from '../user/entities/user.entity';
import { CoinTransaction } from '../coin-transaction/entities/coin-transaction.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User, CoinTransaction])],
  controllers: [WalletController],
  providers: [CoinTransactionService],
})
export class WalletModule {}
