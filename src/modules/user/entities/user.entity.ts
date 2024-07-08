import { DecimalColumnTransformer } from 'src/helper/decimal-column-transformer';
import { CashTransaction } from 'src/modules/cash-transaction/entities/cash-transaction.entity';
import { CoinRequest } from 'src/modules/coin-transaction/entities/coin-request.entity';
import { CoinTransaction } from 'src/modules/coin-transaction/entities/coin-transaction.entity';
import { GameSession } from 'src/modules/game/entities/game-session.entity';
import { Role } from 'src/modules/role/entities/role.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Index('fk_user_created_by_id', ['createdBy'])
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

  @Column({ name: 'property_id', nullable: true })
  propertyId: string;

  @Column({ name: 'widget_id', nullable: true })
  widgetId: string;

  @ManyToMany(() => Role, (role) => role.users, { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
  @JoinTable({
    name: 'user_role',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
  })
  roles: Role[];

  @OneToMany(() => CashTransaction, (cointx) => cointx.player)
  cashTransactions: CashTransaction[];

  @OneToMany(() => CoinTransaction, (cointx) => cointx.player)
  coinTransactions: CoinTransaction[];

  @OneToMany(() => CoinRequest, (r) => r.requestingUser)
  coinRequests: CoinRequest[];

  @OneToMany(() => CoinRequest, (r) => r.reviewingUser)
  actionedRequests: CoinRequest[];

  @OneToMany(() => CoinRequest, (r) => r.defaultReviewUser)
  defaultReviewRequests: CoinRequest[];

  @OneToMany(() => GameSession, (gs) => gs.user)
  gameSessions: GameSession[];

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by_id' })
  createdBy: User;

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

  propertyId(propertyId: string): UserBuilder {
    this.user.propertyId = propertyId;
    return this;
  }

  widgetId(widgetId: string): UserBuilder {
    this.user.widgetId = widgetId;
    return this;
  }

  roles(roles: Role[]): UserBuilder {
    this.user.roles = roles;
    return this;
  }

  createdBy(createdBy: User): UserBuilder {
    this.user.createdBy = createdBy;
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
