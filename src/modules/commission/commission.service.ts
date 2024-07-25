import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, DataSource, Repository, TreeRepository } from 'typeorm';
import { CommissionPaginateDTO, CommissionUnitPaginateDTO } from 'src/schemas/paginate-query.dto';
import { CommissionPool } from './entities/commission-pool.entity';
import { User } from '../user/entities/user.entity';
import { Commission } from './entities/commission.entity';
import { CommissionType } from 'src/enums/commission.enum';
import { UserTopCommissionDTO } from './dto/user-top-commission';

@Injectable()
export class CommissionService {
  private treeUserRepo: TreeRepository<User>;

  constructor(
    @InjectRepository(CommissionPool)
    private readonly poolRepo: Repository<CommissionPool>,

    @InjectRepository(Commission)
    private readonly commissionRepo: Repository<Commission>,

    readonly dataSource: DataSource,
  ) {
    this.treeUserRepo = dataSource.manager.getTreeRepository(User);
  }

  private async _getUserChildrenIds(user: User) {
    const children = await this.treeUserRepo.findDescendants(user);
    return children.map((u) => u.id);
  }

  async findTopUserByCommission(query: UserTopCommissionDTO) {
    const { top, role } = query;
    return this.commissionRepo
      .createQueryBuilder('commission')
      .select('SUM(commission.amount)', 'total')
      .addSelect('user.id', 'userId')
      .addSelect('user.email', 'userEmail')
      .addSelect('user.firstName', 'userFirstName')
      .addSelect('user.lastName', 'userLastName')
      .addSelect('user.phoneNumber', 'userPhoneNumber')
      .leftJoin('commission.user', 'user')
      .leftJoin('commission.pool', 'pool')
      .where('pool.type = :type', { type: CommissionType.GAIN })
      .andWhere(`user.${role} = :isTrue`, { isTrue: true })
      .groupBy('user.id')
      .addGroupBy('user.email')
      .addGroupBy('user.firstName')
      .addGroupBy('user.lastName')
      .addGroupBy('user.phoneNumber')
      .orderBy('total', 'DESC')
      .limit(top)
      .getRawMany();
  }

  async findAllSum(user: User, query: CommissionUnitPaginateDTO) {
    const { page, pageSize, sortOrder, types, roles, startDate, endDate } = query;
    const descendants = await this._getUserChildrenIds(user);

    const roleParams = roles.reduce((a, v) => ({ ...a, [v]: true }), {});
    const roleConditions = roles.map((role) => `user.${role} = :${role}`).join(' OR ');

    const [GAIN, LOSS] = [CommissionType.GAIN, CommissionType.LOSS];

    const queryBuilder = this.commissionRepo
      .createQueryBuilder('commission')
      .leftJoinAndSelect('commission.user', 'user')
      .leftJoinAndSelect('commission.pool', 'pool')
      .select([
        'user.id as "userId"',
        'user.email as email',
        'user.firstName as "firstName"',
        'user.lastName as "lastName"',
        'user.phoneNumber as "phoneNumber"',
        'user.isOwner as "isOwner"',
        'user.isAdmin as "isAdmin"',
        'user.isCityManager as "isCityManager"',
        'user.isMasterAgent as "isMasterAgent"',
        'user.isAgent as "isAgent"',
        'user.isPlayer as "isPlayer"',
        'user.address as address',
        'SUM(CASE WHEN pool.type = :gainType THEN commission.amount ELSE 0 END) as gain',
        'SUM(CASE WHEN pool.type = :lossType THEN commission.amount ELSE 0 END) as loss',
        'SUM(CASE WHEN pool.type = :gainType THEN commission.amount ELSE -commission.amount END) as net',
      ])
      .where('user.id IN (:...descendants)', { descendants })
      .andWhere('pool.type IN (:...types)', { types })
      .andWhere('commission.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .andWhere(
        new Brackets((qb) => {
          qb.where(roleConditions, roleParams);
        }),
      )
      .setParameter('gainType', GAIN)
      .setParameter('lossType', LOSS)
      .orderBy('net', sortOrder)
      .groupBy('user.id, user.email');

    const [items, total] = await Promise.all([
      queryBuilder
        .offset((page - 1) * pageSize)
        .limit(pageSize)
        .getRawMany(),
      queryBuilder.getCount(),
    ]);

    const mappedItems = items.map((item) => ({
      user: {
        id: item.userId,
        email: item.email,
        firstName: item.firstName,
        lastName: item.lastName,
        phoneNumber: item.phoneNumber,
        address: item.address,
        isOwner: item.isOwner,
        isAdmin: item.isAdmin,
        isCityManager: item.isCityManager,
        isMasterAgent: item.isMasterAgent,
        isAgent: item.isAgent,
        isPlayer: item.isPlayer,
      },
      gain: parseFloat(item.gain),
      loss: parseFloat(item.loss),
      net: Math.abs(parseFloat(item.net)),
      type: parseFloat(item.net) >= 0 ? GAIN : LOSS,
    }));

    return {
      total,
      totalPages: Math.ceil(total / pageSize),
      page,
      pageSize,
      items: mappedItems,
    };
  }

  async findAllCommissions(user: User, query: CommissionUnitPaginateDTO) {
    const { page, pageSize, sortOrder, types, roles, startDate, endDate } = query;
    const descendants = await this._getUserChildrenIds(user);

    const roleParams = roles.reduce((a, v) => ({ ...a, [v]: true }), {});
    const roleConditions = roles.map((role) => `user.${role} = :${role}`).join(' OR ');
    const [tx, count] = await this.commissionRepo
      .createQueryBuilder('commission')
      .leftJoinAndSelect('commission.user', 'user')
      .leftJoinAndSelect('commission.pool', 'pool')
      .where('user.id IN (:...descendants)', { descendants })
      .andWhere('commission.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .andWhere('pool.type IN (:...types)', { types })
      .andWhere(
        new Brackets((qb) => {
          qb.where(roleConditions, roleParams);
        }),
      )
      .orderBy('commission.createdAt', sortOrder)
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

  async findAllPools(user: User, query: CommissionPaginateDTO) {
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
