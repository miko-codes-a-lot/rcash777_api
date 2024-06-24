import { HttpException, Injectable } from '@nestjs/common';
import { FormCoinTransactionDto } from './dto/form-coin-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CoinTransaction } from './entities/coin-transaction.entity';
import { PaginationDTO } from 'src/schemas/paginate-query.dto';
import { TransactionType } from 'src/enums/transaction.enum';
import { User } from '../user/entities/user.entity';
import httpStatus from 'http-status';

@Injectable()
export class CoinTransactionService {
  constructor(
    private dataSource: DataSource,

    @InjectRepository(CoinTransaction)
    private coinRepo: Repository<CoinTransaction>,

    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  create(createCoinTransactionDto: FormCoinTransactionDto) {
    return 'This action adds a new coinTransaction' + createCoinTransactionDto;
  }

  async findPlayerById(playerId: string) {
    const player = await this.userRepo.findOne({ where: { id: playerId } });
    if (!player) {
      throw new HttpException(
        { error: { errorCode: 'PLAYER_NOT_FOUND', errorMessage: 'Player not found' } },
        httpStatus.NOT_FOUND,
      );
    }
    return player;
  }

  async computeBalance(playerId: string) {
    await this.findPlayerById(playerId);

    const { debit } = await this.coinRepo
      .createQueryBuilder('coin_transaction')
      .select('SUM(coin_transaction.amount)', 'debit')
      .where('coin_transaction.type = :type', { type: TransactionType.DEBIT })
      .andWhere('coin_transaction.player = :playerId', { playerId })
      .getRawOne();

    const { credit } = await this.coinRepo
      .createQueryBuilder('coin_transaction')
      .select('SUM(coin_transaction.amount)', 'credit')
      .where('coin_transaction.type = :type', { type: TransactionType.CREDIT })
      .andWhere('coin_transaction.player = :playerId', { playerId })
      .getRawOne();

    return debit - credit;
  }

  async findAllPaginated(config: PaginationDTO, playerId?: string) {
    const { page = 1, pageSize = 10, sortBy = 'createdAt', sortOrder = 'asc' } = config;

    const [tx, count] = await this.coinRepo.findAndCount({
      ...(playerId && { where: { player: { id: playerId } } }),
      relations: { player: true, cashTransaction: true, createdBy: true },
      select: {
        createdBy: {
          id: true,
          email: true,
        },
        player: {
          id: true,
          email: true,
        },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { [sortBy]: sortOrder },
    });

    return {
      total: count,
      totalPages: Math.ceil(count / pageSize),
      page,
      pageSize,
      items: tx,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} coinTransaction`;
  }
}
