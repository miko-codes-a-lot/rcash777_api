import { User } from 'src/modules/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CoinTransaction } from './coin-transaction.entity';
import { CoinRequestStatus, CoinRequestType } from 'src/enums/coin-request.enum';

@Index('fk_coin_request_coin_transaction_id', ['coinTransaction'])
@Index('fk_coin_request_requesting_user_id', ['requestingUser'])
@Index('fk_coin_request_reviewing_user_id', ['reviewingUser'])
@Index('fk_coin_request_action_agent_id', ['defaultReviewUser'])
@Entity('coin_request')
export class CoinRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: '' })
  note: string;

  @Column({
    type: 'enum',
    enum: CoinRequestStatus,
    default: CoinRequestStatus.PENDING,
  })
  status: string;

  @Column({
    type: 'enum',
    enum: CoinRequestType,
  })
  type: string;

  @Column()
  amount: number;

  @ManyToOne(() => CoinTransaction, (ct) => ct.coinRequests, { nullable: true })
  @JoinColumn({ name: 'coin_transaction_id' })
  coinTransaction: CoinTransaction;

  @ManyToOne(() => User, (user) => user.coinRequests)
  @JoinColumn({ name: 'requesting_user_id' })
  requestingUser: User;

  @ManyToOne(() => User, (user) => user.actionedRequests, { nullable: true })
  @JoinColumn({ name: 'reviewing_user_id' })
  reviewingUser: User;

  @ManyToOne(() => User, (user) => user.defaultReviewRequests)
  @JoinColumn({ name: 'action_agent_id' })
  defaultReviewUser: User;

  @Column({ name: 'actioned_at', nullable: true })
  public actionedAt: Date;

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

  public static builder(): CoinRequestBuilder {
    return new CoinRequestBuilder();
  }
}

class CoinRequestBuilder {
  private readonly coinRequest: CoinRequest;

  constructor() {
    this.coinRequest = new CoinRequest();
  }

  public id(id: string): CoinRequestBuilder {
    this.coinRequest.id = id;
    return this;
  }

  public note(note: string): CoinRequestBuilder {
    this.coinRequest.note = note;
    return this;
  }

  public status(status: string): CoinRequestBuilder {
    this.coinRequest.status = status;
    return this;
  }

  public type(type: string): CoinRequestBuilder {
    this.coinRequest.type = type;
    return this;
  }

  public amount(amount: number): CoinRequestBuilder {
    this.coinRequest.amount = amount;
    return this;
  }

  public coinTransaction(coinTransaction: CoinTransaction): CoinRequestBuilder {
    this.coinRequest.coinTransaction = coinTransaction;
    return this;
  }

  public requestingUser(user: User): CoinRequestBuilder {
    this.coinRequest.requestingUser = user;
    return this;
  }

  public reviewingUser(user: User): CoinRequestBuilder {
    this.coinRequest.reviewingUser = user;
    return this;
  }

  public defaultReviewUser(user: User): CoinRequestBuilder {
    this.coinRequest.defaultReviewUser = user;
    return this;
  }

  public actionedAt(date: Date): CoinRequestBuilder {
    this.coinRequest.actionedAt = date;
    return this;
  }

  public createdAt(date: Date): CoinRequestBuilder {
    this.coinRequest.createdAt = date;
    return this;
  }

  public updatedAt(date: Date): CoinRequestBuilder {
    this.coinRequest.updatedAt = date;
    return this;
  }

  public build(): CoinRequest {
    return this.coinRequest;
  }
}
