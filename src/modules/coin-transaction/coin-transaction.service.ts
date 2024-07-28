import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, ILike, In, Repository, TreeRepository } from 'typeorm';
import { CoinTransaction } from './entities/coin-transaction.entity';
import { CoinRequestPaginateDTO, PaginationDTO } from 'src/schemas/paginate-query.dto';
import { TransactionType, TransactionTypeCategory } from 'src/enums/transaction.enum';
import { User } from '../user/entities/user.entity';
import httpStatus from 'http-status';
import { CoinRequestDTO } from './dto/coin-request.dto';
import { CoinRequest } from './entities/coin-request.entity';
import { CoinRequestStatus, CoinRequestType } from 'src/enums/coin-request.enum';
import { PaymentChannel } from '../payment-channel/entities/payment-channel.entity';

const DEFAULT_REBATE_PERCENT = 5;
const REBATE_AFTER_ELAPSED_MS = 24 * 60 * 60 * 1000;
const PLAYER_MAX_DEPOSIT_PER_REQUEST = 50000;
const PLAYER_MAX_WITHDRAWAL_PER_DAY = 200000;

/**
 * Commission of internal users are saved in another table
 * Non player can request credits withdrawal without the need to bet it
 * Cash In of player must Credit away from Agent or other admin
 */
@Injectable()
export class CoinTransactionService {
  private treeUserRepo: TreeRepository<User>;

  constructor(
    private dataSource: DataSource,

    @InjectRepository(CoinTransaction)
    private coinRepo: Repository<CoinTransaction>,

    @InjectRepository(CoinRequest)
    private requestRepo: Repository<CoinRequest>,

    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {
    this.treeUserRepo = dataSource.manager.getTreeRepository(User);
  }

  private _checkRequestStatus(request: CoinRequest) {
    if (
      request.status === CoinRequestStatus.APPROVED ||
      request.status === CoinRequestStatus.REJECTED
    )
      throw new BadRequestException('Request has already been processed');
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

  async computeBalance(playerId: string, coinRepo?: Repository<CoinTransaction>) {
    await this.findPlayerById(playerId);
    const repo = coinRepo ?? this.coinRepo;

    const { debit } = await repo
      .createQueryBuilder('coin_transaction')
      .select('SUM(coin_transaction.amount)', 'debit')
      .where('coin_transaction.type = :type', { type: TransactionType.DEBIT })
      .andWhere('coin_transaction.player = :playerId', { playerId })
      .getRawOne();

    const { credit } = await repo
      .createQueryBuilder('coin_transaction')
      .select('SUM(coin_transaction.amount)', 'credit')
      .where('coin_transaction.type = :type', { type: TransactionType.CREDIT })
      .andWhere('coin_transaction.player = :playerId', { playerId })
      .getRawOne();

    return parseFloat(debit || 0) - parseFloat(credit || 0);
  }

  async findSelfPaginated(user: User, config: PaginationDTO) {
    const { page = 1, pageSize = 10, search, sortBy = 'createdAt', sortOrder = 'asc' } = config;

    const amount = parseFloat(search);
    const [tx, count] = await this.coinRepo.findAndCount({
      where: [
        {
          player: {
            id: user.id,
            email: ILike(`%${search}%`),
          },
          ...(!Number.isNaN(amount) && { amount: parseFloat(amount.toFixed(8)) }),
        },
        {
          createdBy: { id: user.id },
          player: {
            email: ILike(`%${search}%`),
          },
          ...(!Number.isNaN(amount) && { amount: parseFloat(amount.toFixed(8)) }),
        },
      ],
      relations: { player: true, createdBy: true, coinRequests: true },
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

  async findAllPaginated(user: User, config: PaginationDTO) {
    const { page = 1, pageSize = 10, search, sortBy = 'createdAt', sortOrder = 'asc' } = config;

    const amount = parseFloat(search);
    const [tx, count] = await this.coinRepo.findAndCount({
      where: {
        player: {
          id: In([user.id, ...(await this._getUserChildrenIds(user))]),
          email: ILike(`%${search}%`),
        },
        ...(!Number.isNaN(amount) && { amount }),
      },
      relations: { player: true, createdBy: true, coinRequests: { reviewingUser: true } },
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

  private async _getUserChildrenIds(user: User) {
    const children = await this.treeUserRepo.findDescendants(user);
    return children.map((u) => u.id);
  }

  async findRequests(user: User, config: CoinRequestPaginateDTO) {
    const {
      page = 1,
      pageSize = 10,
      status,
      type,
      sortBy = 'createdAt',
      sortOrder = 'asc',
    } = config;

    // const ids = await this._getUserChildrenIds(user);

    const [tx, count] = await this.requestRepo.findAndCount({
      where: [
        {
          reviewingUser: { id: user.id },
          status: In(status),
          type,
        },
        // {
        //   requestingUser: { id: In(ids) },
        //   status,
        //   type,
        // },
      ],
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

  async computeTodayWithdrawalTotal(userId: string) {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const result = await this.requestRepo
      .createQueryBuilder('coin_request')
      .select('SUM(coin_request.amount)', 'total')
      .where('coin_request.requesting_user_id = :userId', { userId })
      .andWhere('coin_request.type = :type', { type: CoinRequestType.WITHDRAW })
      .andWhere('coin_request.created_at BETWEEN :startOfDay AND :endOfDay', {
        startOfDay,
        endOfDay,
      })
      .getRawOne();

    return parseFloat(result.total || 0);
  }

  async requestDeposit(user: User, data: CoinRequestDTO) {
    const { amount } = data;
    if (user.isPlayer && amount > PLAYER_MAX_DEPOSIT_PER_REQUEST) {
      throw new BadRequestException(`Request must not exceed ${PLAYER_MAX_DEPOSIT_PER_REQUEST}`);
    }

    const fullUser = await this.userRepo.findOne({
      where: { id: user.id },
      relations: { parent: true },
    });

    return this.dataSource.transaction(async (manager) => {
      const channelRepo = manager.getRepository(PaymentChannel);
      const coinRepo = manager.getRepository(CoinTransaction);
      const requestRepo = manager.getRepository(CoinRequest);

      const channel = await channelRepo.findOneBy({ id: data.paymentChannelId });
      if (!channel) throw new NotFoundException('Channel not found');

      const txDeposit = CoinTransaction.builder()
        .player(fullUser)
        .type(TransactionType.DEBIT)
        .typeCategory(TransactionTypeCategory.DEPOSIT)
        .amount(0) // later we update once approved
        .createdBy(fullUser)
        .paymentChannel(channel)
        .build();

      await coinRepo.save(txDeposit);

      const request = CoinRequest.builder()
        .amount(amount)
        .coinTransaction(txDeposit)
        .requestingUser(fullUser)
        .reviewingUser(fullUser.parent)
        .type(CoinRequestType.DEPOSIT)
        .build();

      return requestRepo.save(request);
    });
  }

  async _optionalRebate(
    actioner: User,
    targetUser: User,
    manager: EntityManager,
    amount: number,
    txDeposit: CoinTransaction,
  ) {
    if (targetUser.isPlayer) {
      const coinRepo = manager.getRepository(CoinTransaction);
      const userRepo = manager.getRepository(User);

      const REBATE_PERCENT = (targetUser.rebate || DEFAULT_REBATE_PERCENT) / 100;

      const lastRebate = await coinRepo.findOne({
        where: {
          player: { id: targetUser.id },
          type: TransactionType.DEBIT,
          typeCategory: TransactionTypeCategory.REBATE,
        },
        order: { createdAt: 'DESC' },
      });

      const now = new Date().getTime();
      const elapsed = now - lastRebate?.createdAt?.getTime();

      if (!lastRebate || elapsed >= REBATE_AFTER_ELAPSED_MS) {
        // disable rebate
        const totalRebate = amount * REBATE_PERCENT * 0;

        const owner = await userRepo.findOneBy({ isOwner: true });
        if (!owner) throw new NotFoundException('Owner not found to shoulder the rebate');

        // owner to pay the rebate
        const txCreditRebate = CoinTransaction.builder()
          .player(owner)
          .coinTransaction(txDeposit)
          .type(TransactionType.CREDIT)
          .typeCategory(TransactionTypeCategory.REBATE)
          .amount(totalRebate)
          .createdBy(owner)
          .build();
        await coinRepo.save(txCreditRebate);

        const coinRebateTx = CoinTransaction.builder()
          .player(targetUser)
          .coinTransaction(txDeposit)
          .type(TransactionType.DEBIT)
          .typeCategory(TransactionTypeCategory.REBATE)
          .amount(totalRebate)
          .createdBy(actioner)
          .build();

        targetUser.coinDeposit += totalRebate;

        await coinRepo.save(coinRebateTx);
      }
    }
  }

  async findOneRequest(id: string) {
    const request = await this.requestRepo.findOne({
      where: { id },
      relations: { coinTransaction: true },
    });
    if (!request) throw new NotFoundException('Request transaction not found');
    return request;
  }

  async rejectDeposit(id: string, user: User) {
    const request = await this.findOneRequest(id);
    this._checkRequestStatus(request);

    request.status = CoinRequestStatus.REJECTED;
    request.actionAgent = user;

    return await this.requestRepo.save(request);
  }

  async approveDeposit(id: string, user: User) {
    return this.dataSource.transaction(async (manager) => {
      const userRepo = manager.getRepository(User);
      const requestRepo = manager.getRepository(CoinRequest);
      const coinRepo = manager.getRepository(CoinTransaction);

      const fullUser = await userRepo.findOneBy({ id: user.id });
      if (!fullUser) throw new NotFoundException('User not found');

      const request = await requestRepo.findOne({
        where: { id },
        relations: { coinTransaction: true, requestingUser: true },
      });
      if (!request) throw new NotFoundException('Transaction not found');

      this._checkRequestStatus(request);

      const approverBalance = await this.computeBalance(user.id, coinRepo);
      if (!fullUser.isOwner && request.amount > approverBalance) {
        throw new BadRequestException('Not enough balance to aprove the deposit');
      }

      const targetUser = request.requestingUser;

      const txDepositData = CoinTransaction.builder()
        .amount(request.amount)
        .type(TransactionType.DEBIT)
        .typeCategory(TransactionTypeCategory.DEPOSIT)
        .paymentChannel(request.coinTransaction.paymentChannel)
        .player(targetUser)
        .createdBy(user)
        .build();

      targetUser.coinDeposit += request.amount;

      const txDeposit = await coinRepo.save(txDepositData);

      const txCreditData = CoinTransaction.builder()
        .amount(request.amount)
        .type(TransactionType.CREDIT)
        .typeCategory(TransactionTypeCategory.DEPOSIT)
        .paymentChannel(request.coinTransaction.paymentChannel)
        .coinTransaction(txDeposit)
        .player(user)
        .createdBy(user)
        .build();

      await coinRepo.save(txCreditData);

      await this._optionalRebate(user, targetUser, manager, request.amount, txDeposit);

      const oldDeposit = { id: request.coinTransaction.id };

      request.coinTransaction = txDeposit;
      request.status = CoinRequestStatus.APPROVED;
      request.actionAgent = user;

      await requestRepo.save(request);
      await userRepo.save(targetUser);
      await coinRepo.delete(oldDeposit);

      return txDeposit;
    });
  }

  async requestWithdraw(user: User, data: CoinRequestDTO) {
    const { amount } = data;
    const todayWithdrawTotal = await this.computeTodayWithdrawalTotal(user.id);
    if (todayWithdrawTotal + amount > PLAYER_MAX_WITHDRAWAL_PER_DAY) {
      throw new BadRequestException(
        `You have reached the daily withdrawal limit of ${PLAYER_MAX_WITHDRAWAL_PER_DAY}`,
      );
    }

    const fullUser = await this.userRepo.findOne({
      where: { id: user.id },
      relations: { parent: true },
    });

    if (fullUser.coinDeposit > 0) {
      throw new BadRequestException('Please bet your deposit first');
    }

    const balance = await this.computeBalance(user.id);
    if (amount > balance) {
      throw new BadRequestException('Not enough remaining balance to proceed');
    }

    return this.dataSource.transaction(async (manager) => {
      const channelRepo = manager.getRepository(PaymentChannel);
      const coinRepo = manager.getRepository(CoinTransaction);
      const requestRepo = manager.getRepository(CoinRequest);

      const channel = await channelRepo.findOneBy({ id: data.paymentChannelId });
      if (!channel) throw new NotFoundException('Channel not found');

      const txWithdraw = CoinTransaction.builder()
        .player(fullUser)
        .type(TransactionType.CREDIT)
        .typeCategory(TransactionTypeCategory.WITHDRAW)
        .amount(amount)
        .createdBy(fullUser)
        .paymentChannel(channel)
        .build();

      await coinRepo.save(txWithdraw);

      const request = CoinRequest.builder()
        .amount(amount)
        .coinTransaction(txWithdraw)
        .requestingUser(fullUser)
        .reviewingUser(fullUser.parent)
        .type(CoinRequestType.WITHDRAW)
        .build();

      return requestRepo.save(request);
    });
  }

  async rejectWithdraw(id: string, user: User) {
    return this.dataSource.transaction(async (manager) => {
      const requestRepo = manager.getRepository(CoinRequest);
      const coinRepo = manager.getRepository(CoinTransaction);

      const request = await requestRepo.findOne({
        where: { id },
        relations: { coinTransaction: true },
      });
      if (!request) throw new NotFoundException('Request transaction not found');

      this._checkRequestStatus(request);

      const oldWithdraw = { id: request.coinTransaction.id };

      const newWithdrawData = request.coinTransaction;
      delete newWithdrawData.id;
      newWithdrawData.amount = 0;
      const newWithdraw = await coinRepo.save(newWithdrawData);

      request.coinTransaction = newWithdraw;
      request.status = CoinRequestStatus.REJECTED;
      request.actionAgent = user;
      await requestRepo.save(request);

      await coinRepo.delete(oldWithdraw);

      return request;
    });
  }

  async transferRequest(id: string, user: User) {
    const fullUser = await this.userRepo.findOne({
      where: { id: user.id },
      relations: { parent: true },
    });
    if (!fullUser) throw new NotFoundException('User not found');

    const request = await this.requestRepo.findOne({
      where: { id },
    });

    this._checkRequestStatus(request);

    request.reviewingUser = fullUser.parent;
    request.status = CoinRequestStatus.TRANSFERRED;

    return this.requestRepo.save(request);
  }

  async approveWithdraw(id: string, user: User) {
    return this.dataSource.transaction(async (manager) => {
      const userRepo = manager.getRepository(User);
      const requestRepo = manager.getRepository(CoinRequest);
      const coinRepo = manager.getRepository(CoinTransaction);

      const fullUser = await userRepo.findOneBy({ id: user.id });
      if (!fullUser) throw new NotFoundException('User not found');

      const request = await requestRepo.findOne({
        where: { id },
        relations: { coinTransaction: true, requestingUser: true },
      });
      if (!request) throw new NotFoundException('Transaction not found');

      this._checkRequestStatus(request);

      const targetUser = request.requestingUser;

      const txCreditData = CoinTransaction.builder()
        .amount(request.amount)
        .type(TransactionType.CREDIT)
        .typeCategory(TransactionTypeCategory.WITHDRAW)
        .paymentChannel(request.coinTransaction.paymentChannel)
        .player(targetUser)
        .createdBy(user)
        .build();

      // we proceed without validation because this withdraw transaction is locked in
      const txCredit = await coinRepo.save(txCreditData);

      const oldWithdraw = { id: request.coinTransaction.id };

      request.coinTransaction = txCredit;
      request.status = CoinRequestStatus.APPROVED;
      request.actionAgent = user;

      await requestRepo.save(request);
      await coinRepo.delete(oldWithdraw);

      return txCredit;
    });
  }
}
