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
import { User } from './user.entity';

@Index('idx_chat_session_user_id_property_id_wiget_id', ['user', 'propertyId', 'widgetId'])
@Index('idx_chat_session_widget_id', ['widgetId'])
@Index('idx_chat_session_property_id', ['propertyId'])
@Index('idx_chat_session_user_id', ['user'])
@Entity('chat_session')
export class ChatSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.chatSessions, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'user_id' }])
  user: User;

  @Column({ name: 'property_id' })
  propertyId: string;

  @Column({ name: 'widget_id' })
  widgetId: string;

  @ManyToOne(() => User, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'created_by_id' }])
  createdBy: User;

  @ManyToOne(() => User, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'updated_by_id' }])
  updatedBy: User;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
  })
  public createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
  })
  public updatedAt: Date;

  static builder() {
    return new ChatSessionBuilder();
  }
}

class ChatSessionBuilder {
  private session: ChatSession;

  constructor() {
    this.session = new ChatSession();
  }

  id(id: string) {
    this.session.id = id;
    return this;
  }

  user(user: User) {
    this.session.user = user;
    return this;
  }

  propertyId(propertyId: string) {
    this.session.propertyId = propertyId;
    return this;
  }

  widgetId(widgetId: string) {
    this.session.widgetId = widgetId;
    return this;
  }

  createdBy(createdBy: User) {
    this.session.createdBy = createdBy;
    return this;
  }

  updatedBy(updatedBy: User) {
    this.session.updatedBy = updatedBy;
    return this;
  }

  build(): ChatSession {
    return this.session;
  }
}
