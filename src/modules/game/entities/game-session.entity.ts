import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from 'src/modules/user/entities/user.entity';

@Entity('game_session')
@Index('fb_game_session_user_id', ['user'])
export class GameSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  token: string;

  @ManyToOne(() => User, (user) => user.gameSessions)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
