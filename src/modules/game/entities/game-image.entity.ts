import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Game } from './game.entity';

@Index('idx_game_image_game_id', ['game'])
@Index('idx_game_image_game_id_resolution', ['game', 'resolution'])
@Entity('game_image')
export class GameImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Game, (game) => game.images)
  @JoinColumn({ name: 'game_id' })
  game: Game;

  @Column()
  resolution: string;

  @Column()
  uri: string;
}
