import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, TreeRepository } from 'typeorm';
import { CommissionPaginateDTO } from 'src/schemas/paginate-query.dto';
import { CommissionPool } from './entities/commission-pool.entity';
import { User } from '../user/entities/user.entity';
import { Commission } from './entities/commission.entity';

@Injectable()
export class CommissionService {
  private treeUserRepo: TreeRepository<User>;

  constructor(
    @InjectRepository(CommissionPool)
    private readonly poolRepo: Repository<CommissionPool>,

    readonly dataSource: DataSource,
  ) {
    this.treeUserRepo = dataSource.manager.getTreeRepository(User);
  }

  private async _getUserChildrenIds(user: User) {
    const children = await this.treeUserRepo.findDescendants(user);
    return children.map((u) => u.id);
  }

  async findAll(user: User, query: CommissionPaginateDTO) {
    const { page, pageSize, sortOrder, types, startDate, endDate } = query;

    const descendants = await this._getUserChildrenIds(user);

    const [tx, count] = await this.poolRepo
      .createQueryBuilder('commissionPool')
      .innerJoinAndSelect('commissionPool.commissions', 'commission')
      .innerJoinAndSelect('commissionPool.player', 'player')
      .where((qb) => {
        const subQuery = qb
          .subQuery()
          .select('1')
          .from(Commission, 'subCommission')
          .where('subCommission.pool = commissionPool.id')
          .andWhere('subCommission.user_player_id IN (:...descendants)', { descendants })
          .getQuery();
        return 'EXISTS (' + subQuery + ')';
      })
      .andWhere('commissionPool.type IN (:...types)', { types })
      .andWhere('commissionPool.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .orderBy('commissionPool.createdAt', sortOrder)
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    return {
      total: count,
      totalPages: Math.ceil(count / pageSize),
      page,
      pageSize,
      items: tx,
    };
  }

  async findOne(user: User, id: string) {
    const descendants = await this._getUserChildrenIds(user);
    const pool = await this.poolRepo
      .createQueryBuilder('commissionPool')
      .innerJoinAndSelect('commissionPool.commissions', 'commission')
      .innerJoinAndSelect('commissionPool.player', 'player')
      .where('commissionPool.id = :id', { id })
      .andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select('1')
          .from(Commission, 'subCommission')
          .where('subCommission.pool = commissionPool.id')
          .andWhere('subCommission.user_player_id IN (:...descendants)', { descendants })
          .getQuery();
        return 'EXISTS (' + subQuery + ')';
      })
      .getOne();

    if (!pool) {
      throw new BadRequestException('Commission not found');
    }

    return pool;
  }
}
