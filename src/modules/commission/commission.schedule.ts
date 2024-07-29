import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DataSource } from 'typeorm';
import { CoinTransaction } from '../coin-transaction/entities/coin-transaction.entity';
import { User } from '../user/entities/user.entity';
import { CommissionPool } from './entities/commission-pool.entity';
import { Commission } from './entities/commission.entity';
import { CommissionType } from 'src/enums/commission.enum';
import { CommissionService } from './commission.service';

@Injectable()
export class CommissionSchedule {
  private readonly logger = new Logger(CommissionSchedule.name);

  constructor(
    private dataSource: DataSource,
    private commissionService: CommissionService,
  ) {}

  @Cron(CronExpression.EVERY_WEEK, {
    name: 'compute_commission',
    timeZone: 'Asia/Singapore',
  })
  performTask() {
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
        const { bet, win } = await this.commissionService.computeCommission(
          partialPlayer,
          sevenDaysAgo,
          now,
          coinRepo,
        );
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
          const owner = parents.find((p) => p.isOwner);
          const cm = parents.find((p) => p.isCityManager);
          const ma = parents.find((p) => p.isMasterAgent);
          const agent = parents.find((p) => p.isAgent);

          owner.rate = (owner.commission - cm.commission) / 100;
          cm.rate = (cm.commission - ma.commission) / 100;
          ma.rate = (ma.commission - agent.commission) / 100;
          agent.rate = agent.commission / 100;

          for (const user of [owner, cm, ma, agent]) {
            const commissionData = Commission.builder()
              .rate(user.commission)
              .amount(pool.amount * user.rate)
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
