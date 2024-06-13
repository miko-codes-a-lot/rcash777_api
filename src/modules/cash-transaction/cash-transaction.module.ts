import { Module } from '@nestjs/common';
import { CashTransactionService } from './cash-transaction.service';
import { CashTransactionController } from './cash-transaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { CashTransaction } from './entities/cash-transaction.entity';
import { PaymentChannel } from '../payment-channel/entities/payment-channel.entity';
import { CoinTransaction } from '../coin-transaction/entities/coin-transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, CashTransaction, PaymentChannel, CoinTransaction])],
  controllers: [CashTransactionController],
  providers: [CashTransactionService],
})
export class CashTransactionModule {}
