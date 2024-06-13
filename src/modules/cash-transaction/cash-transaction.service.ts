import { Injectable } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { FormCashTransactionDTO } from './dto/form-cash-transaction.dto';
import { DataSource, Repository } from 'typeorm';
import { CashTransaction } from './entities/cash-transaction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CoinTransaction } from '../coin-transaction/entities/coin-transaction.entity';
import { TransactionType, TransactionTypeCategory } from 'src/enums/transaction.enum';
import { PaymentChannel } from '../payment-channel/entities/payment-channel.entity';

const CASH_TO_COINS_RATE = 10;
const REBATE_PERCENT = 0.03;

@Injectable()
export class CashTransactionService {
  constructor(
    private dataSource: DataSource,

    @InjectRepository(CashTransaction)
    private cashRepo: Repository<CashTransaction>,
  ) {}

  deposit(agent: User, formData: FormCashTransactionDTO) {
    return this.dataSource.transaction(async (manager) => {
      const cashRepo = manager.getRepository(CashTransaction);
      const coinRepo = manager.getRepository(CoinTransaction);

      const player = User.builder().id(formData.userId).build();

      const cashTx = new CashTransaction();
      cashTx.player = player;
      cashTx.paymentChannel = PaymentChannel.builder().id(formData.paymentChannelId).build();
      cashTx.createdBy = agent;

      const cashTxData = cashRepo.merge(cashTx, formData);

      const depositCount = await cashRepo.count({
        where: {
          player: { id: formData.userId },
          type: TransactionType.DEBIT,
          typeCategory: TransactionTypeCategory.DEPOSIT,
        },
      });

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

      if (depositCount === 0) {
        const coinRebateTx = CoinTransaction.builder()
          .cashTransaction(cashTxData)
          .player(player)
          .type(TransactionType.DEBIT)
          .typeCategory(TransactionTypeCategory.REBATE)
          .amount(coins * REBATE_PERCENT)
          .createdBy(player)
          .build();

        await coinRepo.save(coinRebateTx);
      }

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
