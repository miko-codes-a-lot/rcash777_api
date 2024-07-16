import { CoinTransaction } from 'src/modules/coin-transaction/entities/coin-transaction.entity';
import { User } from 'src/modules/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('payment_channel')
export class PaymentChannel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ default: '' })
  description: string;

  @OneToMany(() => CoinTransaction, (cointx) => cointx.coinTransaction)
  coinTransactions: CoinTransaction[];

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by_id' })
  createdBy: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'updated_by_id' })
  updatedBy: User;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updatedAt: Date;

  static builder() {
    return new PaymentChannelBuilder();
  }
}

class PaymentChannelBuilder {
  private paymentChannel: PaymentChannel;

  constructor() {
    this.paymentChannel = new PaymentChannel();
  }

  id(id: string): PaymentChannelBuilder {
    this.paymentChannel.id = id;
    return this;
  }

  name(name: string): PaymentChannelBuilder {
    this.paymentChannel.name = name;
    return this;
  }

  description(description: string): PaymentChannelBuilder {
    this.paymentChannel.description = description;
    return this;
  }

  createdBy(createdBy: User): PaymentChannelBuilder {
    this.paymentChannel.createdBy = createdBy;
    return this;
  }

  updatedBy(updatedBy: User): PaymentChannelBuilder {
    this.paymentChannel.updatedBy = updatedBy;
    return this;
  }

  createdAt(createdAt: Date): PaymentChannelBuilder {
    this.paymentChannel.createdAt = createdAt;
    return this;
  }

  updatedAt(updatedAt: Date): PaymentChannelBuilder {
    this.paymentChannel.updatedAt = updatedAt;
    return this;
  }

  build(): PaymentChannel {
    return this.paymentChannel;
  }
}
