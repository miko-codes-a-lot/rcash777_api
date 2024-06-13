import { TransactionType, TransactionTypeCategory } from 'src/enums/transaction.enum';
import { DecimalColumnTransformer } from 'src/helper/decimal-column-transformer';
import { CashTransaction } from 'src/modules/cash-transaction/entities/cash-transaction.entity';
import { User } from 'src/modules/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('coin_transaction')
export class CoinTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: '' })
  note: string;

  @Column({
    type: 'enum',
    enum: TransactionType,
    default: TransactionType.DEBIT,
  })
  type: string;

  @Column({
    type: 'enum',
    enum: TransactionTypeCategory,
    name: 'type_category',
    default: TransactionTypeCategory.DEPOSIT,
  })
  typeCategory: string;

  @Column({
    type: 'decimal',
    precision: 18,
    scale: 8,
    transformer: new DecimalColumnTransformer(),
  })
  amount: number;

  @ManyToOne(() => CashTransaction, (cashtx) => cashtx.coinTransactions)
  @JoinColumn({ name: 'cash_transaction_id' })
  cashTransaction: CashTransaction;

  /** @TODO: 2024-06-12 - Miko Chu >> transition later to Game FK */
  @Column({ name: 'game_id', nullable: true })
  gameId: string;

  @ManyToOne(() => User, (user) => user.coinTransactions)
  @JoinColumn({ name: 'user_player_id' })
  player: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by_id' })
  createdBy: User;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public createdAt: Date;

  static builder() {
    return new CoinTransactionBuilder();
  }
}

class CoinTransactionBuilder {
  private coinTransaction: CoinTransaction;

  constructor() {
    this.coinTransaction = new CoinTransaction();
  }

  id(id: string): CoinTransactionBuilder {
    this.coinTransaction.id = id;
    return this;
  }

  note(note: string): CoinTransactionBuilder {
    this.coinTransaction.note = note;
    return this;
  }

  type(type: TransactionType): CoinTransactionBuilder {
    this.coinTransaction.type = type;
    return this;
  }

  typeCategory(typeCategory: TransactionTypeCategory): CoinTransactionBuilder {
    this.coinTransaction.typeCategory = typeCategory;
    return this;
  }

  amount(amount: number): CoinTransactionBuilder {
    this.coinTransaction.amount = amount;
    return this;
  }

  cashTransaction(cashTransaction: CashTransaction): CoinTransactionBuilder {
    this.coinTransaction.cashTransaction = cashTransaction;
    return this;
  }

  gameId(gameId: string): CoinTransactionBuilder {
    this.coinTransaction.gameId = gameId;
    return this;
  }

  player(player: User): CoinTransactionBuilder {
    this.coinTransaction.player = player;
    return this;
  }

  createdBy(createdBy: User): CoinTransactionBuilder {
    this.coinTransaction.createdBy = createdBy;
    return this;
  }

  createdAt(createdAt: Date): CoinTransactionBuilder {
    this.coinTransaction.createdAt = createdAt;
    return this;
  }

  build(): CoinTransaction {
    return this.coinTransaction;
  }
}
