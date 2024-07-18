import { TransactionType, TransactionTypeCategory } from 'src/enums/transaction.enum';
import { DecimalColumnTransformer } from 'src/helper/decimal-column-transformer';
import { Game } from 'src/modules/game/entities/game.entity';
import { User } from 'src/modules/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CoinRequest } from './coin-request.entity';
import { PaymentChannel } from 'src/modules/payment-channel/entities/payment-channel.entity';

@Index('idx_coin_transaction_user_player_id_type_id', ['player', 'type'])
@Index('idx_coin_transaction_transaction_id_type', ['transactionId', 'type'])
@Index('idx_coin_transaction_game_id', ['game'])
@Index('fk_cash_transaction_round_id', ['roundId'])
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

  @ManyToOne(() => CoinTransaction)
  @JoinColumn({ name: 'coin_transaction_id' })
  coinTransaction: CoinTransaction;

  @ManyToOne(() => PaymentChannel, (channel) => channel.coinTransactions, { nullable: true })
  @JoinColumn({ name: 'payment_channel_id' })
  paymentChannel: PaymentChannel;

  @Column({ name: 'transaction_id', nullable: true })
  transactionId: string;

  @Column({ name: 'round_id', nullable: true })
  roundId: string;

  @ManyToOne(() => Game, (game) => game.coinTransactions, { nullable: true })
  @JoinColumn({ name: 'game_id' })
  game: Game;

  @OneToMany(() => CoinRequest, (r) => r.coinTransaction)
  coinRequests: CoinRequest[];

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
  private transaction: CoinTransaction;

  constructor() {
    this.transaction = new CoinTransaction();
  }

  id(id: string): CoinTransactionBuilder {
    this.transaction.id = id;
    return this;
  }

  note(note: string): CoinTransactionBuilder {
    this.transaction.note = note;
    return this;
  }

  type(type: TransactionType): CoinTransactionBuilder {
    this.transaction.type = type;
    return this;
  }

  typeCategory(typeCategory: TransactionTypeCategory): CoinTransactionBuilder {
    this.transaction.typeCategory = typeCategory;
    return this;
  }

  amount(amount: number): CoinTransactionBuilder {
    this.transaction.amount = amount;
    return this;
  }

  coinTransaction(coinTransaction: CoinTransaction): CoinTransactionBuilder {
    this.transaction.coinTransaction = coinTransaction;
    return this;
  }

  paymentChannel(paymentChannel: PaymentChannel): CoinTransactionBuilder {
    this.transaction.paymentChannel = paymentChannel;
    return this;
  }

  roundId(roundId: string): CoinTransactionBuilder {
    this.transaction.roundId = roundId;
    return this;
  }

  transactionId(transactionId: string): CoinTransactionBuilder {
    this.transaction.transactionId = transactionId;
    return this;
  }

  game(game: Game): CoinTransactionBuilder {
    this.transaction.game = game;
    return this;
  }

  player(player: User): CoinTransactionBuilder {
    this.transaction.player = player;
    return this;
  }

  createdBy(createdBy: User): CoinTransactionBuilder {
    this.transaction.createdBy = createdBy;
    return this;
  }

  createdAt(createdAt: Date): CoinTransactionBuilder {
    this.transaction.createdAt = createdAt;
    return this;
  }

  build(): CoinTransaction {
    return this.transaction;
  }
}
