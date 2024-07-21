import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DataSource } from 'typeorm';
import { CoinTransaction } from '../coin-transaction/entities/coin-transaction.entity';
import { TransactionType, TransactionTypeCategory } from 'src/enums/transaction.enum';
import { User } from '../user/entities/user.entity';
import { CommissionPool } from './entities/commission-pool.entity';
import { Commission } from './entities/commission.entity';
import { CommissionType } from 'src/enums/commission.enum';

@Injectable()
export class CommissionSchedule {
  private readonly logger = new Logger(CommissionSchedule.name);
  private debounce = false;

  constructor(private dataSource: DataSource) {}

  @Cron(CronExpression.EVERY_WEEK, {
    name: 'compute_commission',
    timeZone: 'Asia/Singapore',
  })
  performTask() {
    if (!this.debounce) {
      this.debounce = true;
    } else {
      return;
    }
    this.logger.debug('Calculating commisions');

    return this.dataSource.transaction(async (manager) => {
      const coinRepo = manager.getRepository(CoinTransaction);
      const userTreeRepo = manager.getTreeRepository(User);
      const commPoolRepo = manager.getRepository(CommissionPool);
      const commissionRepo = manager.getRepository(Commission);

      const players = await userTreeRepo.find({
        where: { isPlayer: true },
        select: { id: true },
      });

      const now = new Date();
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      for (const partialPlayer of players) {
        const { bet } = await coinRepo
          .createQueryBuilder('coin_transaction')
          .select('SUM(coin_transaction.amount)::numeric(18, 8)', 'bet')
          .where('coin_transaction.type = :type', { type: TransactionType.CREDIT })
          .andWhere('coin_transaction.type_category IN (:...categories)', {
            categories: [TransactionTypeCategory.BET_CREDIT, TransactionTypeCategory.ROLL_BACK],
          })
          .andWhere('coin_transaction.player = :playerId', { playerId: partialPlayer.id })
          .andWhere('coin_transaction.created_at >= :sevenDaysAgo', { sevenDaysAgo })
          .getRawOne();

        const { win } = await coinRepo
          .createQueryBuilder('coin_transaction')
          .select('SUM(coin_transaction.amount)::numeric(18, 8)', 'win')
          .where('coin_transaction.type = :type', { type: TransactionType.DEBIT })
          .andWhere('coin_transaction.type_category IN (:...categories)', {
            categories: [
              TransactionTypeCategory.WIN,
              TransactionTypeCategory.LOSS,
              TransactionTypeCategory.ROLL_BACK,
            ],
          })
          .andWhere('coin_transaction.player = :playerId', { playerId: partialPlayer.id })
          .andWhere('coin_transaction.created_at >= :sevenDaysAgo', { sevenDaysAgo })
          .getRawOne();

        if ((bet || 0) === (win || 0)) continue;

        const commission = win - bet;
        const commissionStatus = commission < 0 ? CommissionType.GAIN : CommissionType.LOSS;

        const parents = await userTreeRepo.findAncestors(partialPlayer);

        const poolData = CommissionPool.builder()
          .amount(Math.abs(commission))
          .type(commissionStatus)
          .player(partialPlayer)
          .createdAt(now)
          .build();
        this.logger.debug(`${partialPlayer.id} - ${poolData.type} - ${poolData.amount}`);

        const pool = await commPoolRepo.save(poolData);

        if (commissionStatus === CommissionType.GAIN) {
          for (const user of parents) {
            if (user.id === partialPlayer.id) continue;
            const rate = user.commission / 100;

            const commissionData = Commission.builder()
              .rate(user.commission)
              .amount(pool.amount * rate)
              .user(user)
              .pool(pool)
              .createdAt(now)
              .build();

            await commissionRepo.save(commissionData);
          }
        } else {
          const admin =
            parents.find((user) => user.isCityManager) ||
            (await userTreeRepo.findOneBy({ isOwner: true }));

          const commissionData = Commission.builder()
            .rate(100)
            .amount(pool.amount)
            .user(admin)
            .pool(pool)
            .createdAt(now)
            .build();

          await commissionRepo.save(commissionData);
        }
      }
    });
  }
}
