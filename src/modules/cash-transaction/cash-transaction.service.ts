import { Injectable } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { FormCashTransactionDTO } from './dto/form-cash-transaction.dto';
import { DataSource, Repository } from 'typeorm';
import { CashTransaction } from './entities/cash-transaction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CoinTransaction } from '../coin-transaction/entities/coin-transaction.entity';
import { TransactionType, TransactionTypeCategory } from 'src/enums/transaction.enum';
import { PaymentChannel } from '../payment-channel/entities/payment-channel.entity';

// owner account source ng pera
// owner -> city manager -> agent

// owner splits 50% with city manager
// city manager splits the rest with agent

// owner can set percentage to individual agent
// city manager can set percentage to individual agent
// rebate however is constant for every agent
// NO MORE CASHBACK

// rebate every 24 hours on the first time

// player cash in 300 pesos goes to casino if player lossess

const CASH_TO_COINS_RATE = 1;
const AGENT_COMISSION_FEE = 0.1; // 10%
const REBATE_PERCENT = 0.03; // 3%
const REBATE_AFTER_ELAPSED_MS = 24 * 60 * 60 * 1000;

@Injectable()
export class CashTransactionService {
  constructor(
    private dataSource: DataSource,

    @InjectRepository(CashTransaction)
    private cashRepo: Repository<CashTransaction>,
  ) {}

  // @TODO: 2024-06-13: Add triggers to automatically increment/decrement the user coin debit
  // @TODO: 2024-06-13: Casino only wins if player loses as such agent only gets commission upon player losing
  // @TODO: 2024-06-13: Save commission to a separate table
  deposit(agent: User, formData: FormCashTransactionDTO) {
    return this.dataSource.transaction(async (manager) => {
      const userRepo = manager.getRepository(User);
      const cashRepo = manager.getRepository(CashTransaction);
      const coinRepo = manager.getRepository(CoinTransaction);

      // const player = User.builder().id(formData.playerId).build();
      const player = await userRepo.findOne({ where: { id: formData.playerId } });

      const cashTx = new CashTransaction();
      cashTx.player = player;
      cashTx.paymentChannel = PaymentChannel.builder().id(formData.paymentChannelId).build();
      cashTx.createdBy = agent;

      const cashTxData = cashRepo.merge(cashTx, formData);

      await cashRepo.save(cashTxData);

      const coins = cashTxData.amount * CASH_TO_COINS_RATE;

      const coinTx = CoinTransaction.builder()
        .cashTransaction(cashTxData)
        .player(player)
        .type(TransactionType.DEBIT)
        .typeCategory(TransactionTypeCategory.DEPOSIT)
        .amount(coins)
        .createdBy(agent)
        .build();

      await coinRepo.save(coinTx);

      const lastRebate = await coinRepo.findOne({
        where: {
          player: { id: formData.playerId },
          type: TransactionType.DEBIT,
          typeCategory: TransactionTypeCategory.REBATE,
        },
        order: { createdAt: 'DESC' },
      });

      const now = new Date().getTime();
      const elapsed = now - lastRebate?.createdAt?.getTime();

      if (!lastRebate || elapsed >= REBATE_AFTER_ELAPSED_MS) {
        const coinRebate = coins * REBATE_PERCENT;

        const coinRebateTx = CoinTransaction.builder()
          .cashTransaction(cashTxData)
          .player(player)
          .type(TransactionType.DEBIT)
          .typeCategory(TransactionTypeCategory.REBATE)
          .amount(coinRebate)
          .createdBy(player)
          .build();

        player.coinDeposit += coinRebate;

        await coinRepo.save(coinRebateTx);
      }

      player.coinDeposit += coins;

      await userRepo.save(player);

      return cashTx;
    });
  }

  findAll() {
    return `This action returns all cashTransaction`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cashTransaction`;
  }
}
