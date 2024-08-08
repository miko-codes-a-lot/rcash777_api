import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { CoinTransaction } from 'src/modules/coin-transaction/entities/coin-transaction.entity';
import { DecimalColumnTransformer } from 'src/helper/decimal-column-transformer';
import { GameImage } from './game-image.entity';

@Index('idx_game_name_category', ['name', 'category'])
@Index('idx_game_category', ['category'])
@Index('idx_game_code', ['code'])
@Entity('game')
export class Game {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  code: string;

  @Column()
  category: string;

  @Column({ name: 'provider_code' })
  providerCode: string;

  @Column({ name: 'is_provider_in_maintenance' })
  isProviderInMaintenance: boolean;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'jackpot_class' })
  jackpotClass: string;

  @Column({
    name: 'jackpot_contribution',
    type: 'decimal',
    default: 0,
    precision: 5,
    scale: 2,
    nullable: true,
    transformer: new DecimalColumnTransformer(),
  })
  jackpotContribution: number;

  @Column({ name: 'is_demo_allowed' })
  isDemoAllowed: boolean;

  @Column({ name: 'is_freeround_supported' })
  isFreeroundSupported: boolean;

  @OneToMany(() => CoinTransaction, (cointx) => cointx.game)
  coinTransactions: CoinTransaction[];

  @Column({
    type: 'decimal',
    default: 0,
    precision: 5,
    scale: 2,
    transformer: new DecimalColumnTransformer(),
  })
  rtp: number;

  @OneToMany(() => GameImage, (image) => image.game)
  images: GameImage[];
}
