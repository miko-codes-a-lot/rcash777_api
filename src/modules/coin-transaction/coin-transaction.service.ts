import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { FormCoinTransactionDto } from './dto/form-coin-transaction.dto';
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
import { DepositDataDTO } from './dto/deposit-data.dt';

const REBATE_PERCENT = 0.03; // 3%
const REBATE_AFTER_ELAPSED_MS = 24 * 60 * 60 * 1000;

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

  async requestDeposit(user: User, data: CoinRequestDTO) {
    const { amount } = data;
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
    coinMasterBalance: number,
    txDeposit: CoinTransaction,
  ) {
    if (targetUser.isPlayer) {
      const coinRepo = manager.getRepository(CoinTransaction);
      const userRepo = manager.getRepository(User);

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
        const totalRebate = amount * REBATE_PERCENT;
        if (totalRebate > coinMasterBalance - amount - totalRebate) {
          throw new BadRequestException('Not enough balance to topup the user');
        }

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

  async deposit(user: User, data: DepositDataDTO) {
    return this.dataSource.transaction(async (manager) => {
      const userRepo = manager.getRepository(User);
      const coinRepo = manager.getRepository(CoinTransaction);
      const paymentRepo = manager.getRepository(PaymentChannel);

      const targetUser = await userRepo.findOneBy({ id: data.userId });
      const payment = await paymentRepo.findOneBy({ id: data.paymentChannelId });

      if (!targetUser) throw new NotFoundException('User not found');
      if (!payment) throw new NotFoundException('Payment channel not found');

      if (!user.isOwner && targetUser.isCityManager) {
        throw new BadRequestException('Only an Owner can topup the City Manager');
      } else if (!user.isCityManager && targetUser.isMasterAgent) {
        throw new BadRequestException('Only a City Manager can topup the Master Agent');
      } else if (!user.isMasterAgent && targetUser.isAgent) {
        throw new BadRequestException('Only a Master Agent can topup the Agent');
      } else if (!user.isAgent && targetUser.isPlayer) {
        throw new BadRequestException('Only an Agent can topup the Player');
      }

      const txDepositData = CoinTransaction.builder()
        .amount(data.amount)
        .type(TransactionType.DEBIT)
        .typeCategory(TransactionTypeCategory.DEPOSIT)
        .paymentChannel(payment)
        .player(targetUser)
        .createdBy(user)
        .build();

      const txDeposit = await coinRepo.save(txDepositData);

      const coinMasterBalance = await this.computeBalance(user.id);
      const txCredit = CoinTransaction.builder()
        .amount(data.amount)
        .coinTransaction(txDeposit)
        .type(TransactionType.CREDIT)
        .typeCategory(TransactionTypeCategory.DEPOSIT)
        .player(user)
        .createdBy(user)
        .build();

      await coinRepo.save(txCredit);

      if (!user.isOwner && data.amount > coinMasterBalance) {
        throw new BadRequestException('Not enough balance to topup the user');
      }

      await this._optionalRebate(
        user,
        targetUser,
        manager,
        data.amount,
        coinMasterBalance,
        txDeposit,
      );

      targetUser.coinDeposit += data.amount;

      await userRepo.save(targetUser);

      return txDeposit;
    });
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

      const coinMasterBalance = await this.computeBalance(user.id, coinRepo);
      const txDeposit = await coinRepo.save(txDepositData);

      await this._optionalRebate(
        user,
        targetUser,
        manager,
        request.amount,
        coinMasterBalance,
        txDeposit,
      );

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

  findOne(id: number) {
    return `This action returns a #${id} coinTransaction`;
  }
}
