import { TransactionType, TransactionTypeCategory } from 'src/enums/transaction.enum';
import { DecimalColumnTransformer } from 'src/helper/decimal-column-transformer';
import { CoinTransaction } from 'src/modules/coin-transaction/entities/coin-transaction.entity';
import { PaymentChannel } from 'src/modules/payment-channel/entities/payment-channel.entity';
import { User } from 'src/modules/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('cash_transaction')
export class CashTransaction {
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
    name: 'type_category',
    enum: TransactionTypeCategory,
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

  @ManyToOne(() => User, (user) => user.cashTransactions)
  @JoinColumn({ name: 'user_player_id' })
  player: User;

  @ManyToOne(() => PaymentChannel, (channel) => channel.cashTransactions)
  @JoinColumn({ name: 'payment_channel_id' })
  paymentChannel: PaymentChannel;

  @OneToMany(() => CoinTransaction, (cointx) => cointx.cashTransaction)
  coinTransactions: CoinTransaction[];

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by_id' })
  createdBy: User;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public createdAt: Date;
}