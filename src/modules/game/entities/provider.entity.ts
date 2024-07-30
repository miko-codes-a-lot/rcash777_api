import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('idx_provider_name', ['name'])
@Index('idx_provider_code', ['code'])
@Entity('provider')
export class Provider {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  code: string;

  @Column({ nullable: true })
  icon: string;
}
