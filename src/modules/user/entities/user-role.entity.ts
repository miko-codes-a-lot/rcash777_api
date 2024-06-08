import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { User } from "./user.entity";
import { Role } from "src/modules/role/entities/role.entity";

@Entity('user_role')
export class UserRole {
  @PrimaryColumn({ name: 'user_id' })
  userId: string;

  @PrimaryColumn({ name: 'role_id' })
  roleId: string;

  @ManyToOne(() => User, user => user.roles, { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  users: User[]

  @ManyToOne(() => Role, role => role.users, { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
  @JoinColumn([{ name: 'role_id', referencedColumnName: 'id' }])
  roles: Role[]
}
