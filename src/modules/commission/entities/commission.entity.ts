import { DecimalColumnTransformer } from 'src/helper/decimal-column-transformer';
import { User } from 'src/modules/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CommissionPool } from './commission-pool.entity';

@Entity('commission')
export class Commission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  rate: number;

  @Column({
    type: 'decimal',
    precision: 18,
    scale: 8,
    transformer: new DecimalColumnTransformer(),
  })
  amount: number;

  @ManyToOne(() => CommissionPool, (doc) => doc.commissions)
  @JoinColumn({ name: 'commission_pool_id' })
  pool: CommissionPool;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_player_id' })
  user: User;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  static builder() {
    return new CommissionBuilder();
  }
}

class CommissionBuilder {
  private commission: Commission;

  constructor() {
    this.commission = new Commission();
  }

  id(id: string) {
    this.commission.id = id;
    return this;
  }

  rate(rate: number) {
    this.commission.rate = rate;
    return this;
  }

  amount(amount: number) {
    this.commission.amount = amount;
    return this;
  }

  pool(pool: CommissionPool) {
    this.commission.pool = pool;
    return this;
  }

  user(user: User) {
    this.commission.user = user;
    return this;
  }

  createdAt(createdAt: Date) {
    this.commission.createdAt = createdAt;
    return this;
  }

  build() {
    return this.commission;
  }
}
