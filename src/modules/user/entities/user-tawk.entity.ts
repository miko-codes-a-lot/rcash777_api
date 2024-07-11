import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('user_tawk')
export class UserTawk {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'property_id' })
  propertyId: string;

  @Column({ name: 'widget_id' })
  widgetId: string;

  @OneToMany(() => User, (user) => user.tawkto)
  users: User[];
}
