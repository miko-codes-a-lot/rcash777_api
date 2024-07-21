import { Module } from '@nestjs/common';
import { CommissionService } from './commission.service';
import { CommissionController } from './commission.controller';
import { CommissionSchedule } from './commission.schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { CoinTransaction } from '../coin-transaction/entities/coin-transaction.entity';
import { Commission } from './entities/commission.entity';
import { CommissionPool } from './entities/commission-pool.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, CoinTransaction, Commission, CommissionPool])],
  controllers: [CommissionController],
  providers: [CommissionService, CommissionSchedule],
})
export class CommissionModule {}
