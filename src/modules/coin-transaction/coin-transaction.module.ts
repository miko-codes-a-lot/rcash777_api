import { Module } from '@nestjs/common';
import { CoinTransactionService } from './coin-transaction.service';
import { CoinTransactionController } from './coin-transaction.controller';

@Module({
  controllers: [CoinTransactionController],
  providers: [CoinTransactionService],
})
export class CoinTransactionModule {}
