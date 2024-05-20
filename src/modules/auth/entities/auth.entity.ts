import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Auth {
  @PrimaryColumn()
  user_id: number;

  @Column()
  access_token: string;

  @Column()
  refresh_token: string;
}
