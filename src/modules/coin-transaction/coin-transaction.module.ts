import { Module } from '@nestjs/common';
import { CoinTransactionService } from './coin-transaction.service';
import { CoinTransactionController } from './coin-transaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { CashTransaction } from '../cash-transaction/entities/cash-transaction.entity';
import { CoinTransaction } from './entities/coin-transaction.entity';
import { CoinRequest } from './entities/coin-request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, CashTransaction, CoinTransaction, CoinRequest])],
  controllers: [CoinTransactionController],
  providers: [CoinTransactionService],
  exports: [CoinTransactionService],
})
export class CoinTransactionModule {}
