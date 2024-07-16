import { DecimalColumnTransformer } from 'src/helper/decimal-column-transformer';
import { CoinRequest } from 'src/modules/coin-transaction/entities/coin-request.entity';
import { CoinTransaction } from 'src/modules/coin-transaction/entities/coin-transaction.entity';
import { GameSession } from 'src/modules/game/entities/game-session.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
  UpdateDateColumn,
} from 'typeorm';
import { UserTawk } from './user-tawk.entity';

@Index('fk_user_isOwner', ['isOwner'])
@Index('fk_user_isAdmin', ['isAdmin'])
@Index('fk_user_isCityManager', ['isCityManager'])
@Index('fk_user_isMasterAgent', ['isMasterAgent'])
@Index('fk_user_isAgent', ['isAgent'])
@Index('fk_user_isPlayer', ['isPlayer'])
@Index('fk_user_parent', ['parent'])
@Index('fk_user_updated_by_id', ['updatedBy'])
@Index('fk_user_deactivated_by_id', ['deactivatedBy'])
@Index('fk_user_activated_by_id', ['activatedBy'])
@Index('idx_user_email_first_name_last_name_phone_number', ['firstName', 'lastName', 'phoneNumber'])
@Index('idx_user_email_first_name_last_name_phone_number_created_at', [
  'firstName',
  'lastName',
  'phoneNumber',
  'createdAt',
])
@Tree('closure-table')
@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ name: 'phone_number' })
  phoneNumber: string;

  @Column()
  address: string;

  @Column({
    name: 'coin_deposit',
    type: 'decimal',
    precision: 18,
    scale: 8,
    default: 0,
    transformer: new DecimalColumnTransformer(),
  })
  coinDeposit: number;

  @Column({ nullable: false, select: false })
  password: string;

  @Column({ name: 'is_owner', default: false })
  isOwner: boolean;

  @Column({ name: 'is_admin', default: false })
  isAdmin: boolean;

  @Column({ name: 'is_city_manager', default: false })
  isCityManager: boolean;

  @Column({ name: 'is_master_agent', default: false })
  isMasterAgent: boolean;

  @Column({ name: 'is_agent', default: false })
  isAgent: boolean;

  @Column({ name: 'is_player', default: false })
  isPlayer: boolean;

  @ManyToOne(() => UserTawk, (tawk) => tawk.users, { nullable: true })
  @JoinColumn({ name: 'tawk_id' })
  tawkto: UserTawk;

  @OneToMany(() => CoinTransaction, (cointx) => cointx.player)
  coinTransactions: CoinTransaction[];

  @OneToMany(() => CoinRequest, (r) => r.requestingUser)
  coinRequests: CoinRequest[];

  @OneToMany(() => CoinRequest, (r) => r.reviewingUser)
  actionedRequests: CoinRequest[];

  @OneToMany(() => CoinRequest, (r) => r.actionAgent)
  defaultReviewRequests: CoinRequest[];

  @OneToMany(() => GameSession, (gs) => gs.user)
  gameSessions: GameSession[];

  @TreeChildren()
  children: User[];

  @TreeParent()
  parent: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'updated_by_id' })
  updatedBy: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'deactivated_by_id' })
  deactivatedBy: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'activated_by_id' })
  activatedBy: User;

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

  @Column({ name: 'deactivated_at', type: 'timestamptz', nullable: true })
  public deactivatedAt: Date;

  @Column({ name: 'activated_at', type: 'timestamptz', nullable: true })
  public activatedAt: Date;

  static builder() {
    return new UserBuilder();
  }
}

class UserBuilder {
  private user: User;

  constructor() {
    this.user = new User();
  }

  id(id: string): UserBuilder {
    this.user.id = id;
    return this;
  }

  email(email: string): UserBuilder {
    this.user.email = email;
    return this;
  }

  firstName(firstName: string): UserBuilder {
    this.user.firstName = firstName;
    return this;
  }

  lastName(lastName: string): UserBuilder {
    this.user.lastName = lastName;
    return this;
  }

  phoneNumber(phoneNumber: string): UserBuilder {
    this.user.phoneNumber = phoneNumber;
    return this;
  }

  address(address: string): UserBuilder {
    this.user.address = address;
    return this;
  }

  password(password: string): UserBuilder {
    this.user.password = password;
    return this;
  }

  tawkto(tawkto: UserTawk) {
    this.user.tawkto = tawkto;
    return this;
  }

  isOwner(isOwner: boolean) {
    this.user.isOwner = isOwner;
    return this;
  }

  isAdmin(isAdmin: boolean) {
    this.user.isAdmin = isAdmin;
    return this;
  }

  isCityManager(isCityManager: boolean) {
    this.user.isCityManager = isCityManager;
    return this;
  }

  isMasterAgent(isMasterAgent: boolean) {
    this.user.isMasterAgent = isMasterAgent;
    return this;
  }

  isAgent(isAgent: boolean) {
    this.user.isAgent = isAgent;
    return this;
  }

  isPlayer(isPlayer: boolean) {
    this.user.isPlayer = isPlayer;
    return this;
  }

  parent(parent: User): UserBuilder {
    this.user.parent = parent;
    return this;
  }

  children(children: User[]) {
    this.user.children = children;
    return this;
  }

  updatedBy(updatedBy: User): UserBuilder {
    this.user.updatedBy = updatedBy;
    return this;
  }

  deactivatedBy(deactivatedBy: User): UserBuilder {
    this.user.deactivatedBy = deactivatedBy;
    return this;
  }

  activatedBy(activatedBy: User): UserBuilder {
    this.user.activatedBy = activatedBy;
    return this;
  }

  createdAt(createdAt: Date): UserBuilder {
    this.user.createdAt = createdAt;
    return this;
  }

  updatedAt(updatedAt: Date): UserBuilder {
    this.user.updatedAt = updatedAt;
    return this;
  }

  deactivatedAt(deactivatedAt: Date): UserBuilder {
    this.user.deactivatedAt = deactivatedAt;
    return this;
  }

  activatedAt(activatedAt: Date): UserBuilder {
    this.user.activatedAt = activatedAt;
    return this;
  }

  build(): User {
    return this.user;
  }
}
