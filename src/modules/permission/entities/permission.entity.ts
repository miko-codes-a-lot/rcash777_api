import { Role } from 'src/modules/role/entities/role.entity';
import { User } from 'src/modules/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('permission')
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  code: string;

  @Column({ default: '' })
  description: string;

  @ManyToMany(() => Role, (role) => role.permissions, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  roles: Role[];

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by_id' })
  createdBy: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'updated_by_id' })
  updatedBy: User;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updatedAt: Date;

  static builder() {
    return new PermissionBuilder();
  }
}

class PermissionBuilder {
  private readonly permission: Permission;

  constructor() {
    this.permission = new Permission();
  }

  id(id: string): PermissionBuilder {
    this.permission.id = id;
    return this;
  }

  name(name: string): PermissionBuilder {
    this.permission.name = name;
    return this;
  }

  code(code: string): PermissionBuilder {
    this.permission.code = code;
    return this;
  }

  description(description: string): PermissionBuilder {
    this.permission.description = description;
    return this;
  }

  roles(roles: Role[]): PermissionBuilder {
    this.permission.roles = roles;
    return this;
  }

  createdBy(user: User): PermissionBuilder {
    this.permission.createdBy = user;
    return this;
  }

  updatedBy(user: User): PermissionBuilder {
    this.permission.updatedBy = user;
    return this;
  }

  createdAt(createdAt: Date): PermissionBuilder {
    this.permission.createdAt = createdAt;
    return this;
  }

  updatedAt(updatedAt: Date): PermissionBuilder {
    this.permission.updatedAt = updatedAt;
    return this;
  }

  build(): Permission {
    return this.permission;
  }
}
