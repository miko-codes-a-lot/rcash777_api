import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { GameImage } from './game-image.entity';
import { CoinTransaction } from 'src/modules/coin-transaction/entities/coin-transaction.entity';

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

  @Column({ name: 'jackpot_class' })
  jackpotClass: string;

  @Column({ name: 'jackpot_contribution', nullable: true })
  jackpotContribution: number;

  @Column({ name: 'is_demo_allowed' })
  isDemoAllowed: boolean;

  @Column({ name: 'is_freeround_supported' })
  isFreeroundSupported: boolean;

  @OneToMany(() => CoinTransaction, (cointx) => cointx.game)
  coinTransactions: CoinTransaction[];

  @Column()
  rtp: number;

  @OneToMany(() => GameImage, (image) => image.game)
  images: GameImage[];
}
