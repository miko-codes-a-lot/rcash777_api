import { TransactionType, TransactionTypeCategory } from 'src/enums/transaction.enum';
import { DecimalColumnTransformer } from 'src/helper/decimal-column-transformer';
import { CashTransaction } from 'src/modules/cash-transaction/entities/cash-transaction.entity';
import { Game } from 'src/modules/game/entities/game.entity';
import { User } from 'src/modules/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Index('idx_coin_transaction_user_player_id_type_id', ['player', 'type'])
@Index('idx_coin_transaction_transaction_id_type', ['transactionId', 'type'])
@Index('idx_coin_transaction_game_id', ['game'])
@Index('idx_cash_transaction_round_id', ['roundId'])
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

  @Column({ name: 'transaction_id', nullable: true })
  transactionId: string;

  @Column({ name: 'round_id', nullable: true })
  roundId: string;

  @ManyToOne(() => Game, (game) => game.coinTransactions, { nullable: true })
  @JoinColumn({ name: 'game_id' })
  game: Game;

  @ManyToOne(() => User, (user) => user.coinTransactions)
  @JoinColumn({ name: 'user_player_id' })
  player: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by_id' })
  createdBy: User;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
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

  roundId(roundId: string): CoinTransactionBuilder {
    this.coinTransaction.roundId = roundId;
    return this;
  }

  transactionId(transactionId: string): CoinTransactionBuilder {
    this.coinTransaction.transactionId = transactionId;
    return this;
  }

  game(game: Game): CoinTransactionBuilder {
    this.coinTransaction.game = game;
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
