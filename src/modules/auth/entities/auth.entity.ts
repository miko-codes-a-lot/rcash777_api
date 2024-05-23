import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Auth {
  @PrimaryColumn('uuid')
  user_id: string;

  @Column()
  access_token: string;

  @Column()
  refresh_token: string;
}
