import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { FormCoinTransactionDto } from './dto/form-coin-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CoinTransaction } from './entities/coin-transaction.entity';
import { PaginationDTO } from 'src/schemas/paginate-query.dto';
import { TransactionType, TransactionTypeCategory } from 'src/enums/transaction.enum';
import { User } from '../user/entities/user.entity';
import httpStatus from 'http-status';
import { CoinRequestDTO } from './dto/coin-request.dto';
import { CoinRequest } from './entities/coin-request.entity';
import { CoinRequestType } from 'src/enums/coin-request.enum';

@Injectable()
export class CoinTransactionService {
  constructor(
    private dataSource: DataSource,

    @InjectRepository(CoinTransaction)
    private coinRepo: Repository<CoinTransaction>,

    @InjectRepository(CoinRequest)
    private requestRepo: Repository<CoinRequest>,

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

    return parseFloat(debit || 0) - parseFloat(credit || 0);
  }

  async findAllPaginated(config: PaginationDTO, playerId?: string) {
    const { page = 1, pageSize = 10, sortBy = 'createdAt', sortOrder = 'asc' } = config;

    const [tx, count] = await this.coinRepo.findAndCount({
      ...(playerId && { where: { player: { id: playerId } } }),
      relations: { player: true, cashTransaction: true, createdBy: true, coinRequests: true },
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

  async findRequests(user: User, config: PaginationDTO) {
    const { page = 1, pageSize = 10, sortBy = 'createdAt', sortOrder = 'asc' } = config;

    const [tx, count] = await this.requestRepo.findAndCount({
      where: {
        reviewingUser: { id: user.id },
      },
      relations: { requestingUser: true },
      select: {
        requestingUser: {
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

  async requestDeposit(user: User, data: CoinRequestDTO) {
    const { amount } = data;
    const fullUser = await this.userRepo.findOne({
      where: { id: user.id },
      relations: { createdBy: true },
    });

    return this.dataSource.transaction(async (manager) => {
      const coinRepo = manager.getRepository(CoinTransaction);
      const requestRepo = manager.getRepository(CoinRequest);

      const txDeposit = CoinTransaction.builder()
        .player(fullUser)
        .type(TransactionType.DEBIT)
        .typeCategory(TransactionTypeCategory.DEPOSIT)
        .amount(0) // later we update once approved
        .createdBy(fullUser)
        .build();

      await coinRepo.save(txDeposit);

      const request = CoinRequest.builder()
        .amount(amount)
        .coinTransaction(txDeposit)
        .requestingUser(fullUser)
        .actionAgent(fullUser.createdBy)
        .type(CoinRequestType.DEPOSIT)
        .build();

      return requestRepo.save(request);
    });
  }

  async requestWithdraw(user: User, data: CoinRequestDTO) {
    const { amount } = data;
    const fullUser = await this.userRepo.findOne({
      where: { id: user.id },
      relations: { createdBy: true },
    });

    const balance = await this.computeBalance(user.id);
    if (amount > balance) {
      throw new BadRequestException('Not enough remaining balance to proceed');
    }

    return this.dataSource.transaction(async (manager) => {
      const coinRepo = manager.getRepository(CoinTransaction);
      const requestRepo = manager.getRepository(CoinRequest);

      const txWithdraw = CoinTransaction.builder()
        .player(fullUser)
        .type(TransactionType.CREDIT)
        .typeCategory(TransactionTypeCategory.WITHDRAW)
        .amount(amount)
        .createdBy(fullUser)
        .build();

      await coinRepo.save(txWithdraw);

      const request = CoinRequest.builder()
        .amount(amount)
        .coinTransaction(txWithdraw)
        .requestingUser(fullUser)
        .reviewingUser(fullUser.createdBy)
        .type(CoinRequestType.WITHDRAW)
        .build();

      return requestRepo.save(request);
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} coinTransaction`;
  }
}
