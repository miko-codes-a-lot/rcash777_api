import { CommissionType } from 'src/enums/commission.enum';
import { DecimalColumnTransformer } from 'src/helper/decimal-column-transformer';
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
import { Commission } from './commission.entity';

@Entity('commission-pool')
export class CommissionPool {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'decimal',
    precision: 18,
    scale: 8,
    transformer: new DecimalColumnTransformer(),
  })
  amount: number;

  @Column({
    type: 'enum',
    enum: CommissionType,
    name: 'type',
    default: CommissionType.GAIN,
  })
  type: string;

  @OneToMany(() => Commission, (doc) => doc.pool)
  commissions: Commission[];

  @ManyToOne(() => User, (user) => user.commissionPools)
  @JoinColumn({ name: 'user_player_id' })
  player: User;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  static builder() {
    return new CommissionPoolBuilder();
  }
}

class CommissionPoolBuilder {
  private pool: CommissionPool;

  constructor() {
    this.pool = new CommissionPool();
  }

  id(id: string) {
    this.pool.id = id;
    return this;
  }

  amount(amount: number) {
    this.pool.amount = amount;
    return this;
  }

  type(type: string) {
    this.pool.type = type;
    return this;
  }

  player(player: User) {
    this.pool.player = player;
    return this;
  }

  createdAt(createdAt: Date) {
    this.pool.createdAt = createdAt;
    return this;
  }

  build() {
    return this.pool;
  }
}
