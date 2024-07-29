import { Module } from '@nestjs/common';
import { CommissionService } from './commission.service';
import { CommissionController } from './commission.controller';
import { CommissionSchedule } from './commission.schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { CoinTransaction } from '../coin-transaction/entities/coin-transaction.entity';
import { Commission } from './entities/commission.entity';
import { CommissionPool } from './entities/commission-pool.entity';
import { CoinTransactionService } from '../coin-transaction/coin-transaction.service';
import { CoinRequest } from '../coin-transaction/entities/coin-request.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      CoinTransaction,
      Commission,
      CommissionPool,
      CoinTransaction,
      CoinRequest,
    ]),
  ],
  controllers: [CommissionController],
  providers: [CommissionService, CommissionSchedule, CoinTransactionService],
})
export class CommissionModule {}
