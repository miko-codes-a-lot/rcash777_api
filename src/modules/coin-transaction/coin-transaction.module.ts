import { Module } from '@nestjs/common';
import { CoinTransactionService } from './coin-transaction.service';
import { CoinTransactionController } from './coin-transaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { CoinTransaction } from './entities/coin-transaction.entity';
import { CoinRequest } from './entities/coin-request.entity';
import { PaymentChannel } from '../payment-channel/entities/payment-channel.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, CoinTransaction, CoinRequest, PaymentChannel])],
  controllers: [CoinTransactionController],
  providers: [CoinTransactionService],
  exports: [CoinTransactionService],
})
export class CoinTransactionModule {}
