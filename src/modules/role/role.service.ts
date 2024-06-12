import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { FormRoleDTO } from './dto/form-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { In, ILike, Not, Repository, DataSource } from 'typeorm';
import { Permission } from '../permission/entities/permission.entity';
import { Role } from './entities/role.entity';
import { PaginationDTO } from 'src/schemas/paginate-query.dto';

@Injectable()
export class RoleService {
  constructor(
    private dataSource: DataSource,

    @InjectRepository(Role)
    private roleRepo: Repository<Role>,
  ) {}

  createOrUpdate(user: User, formData: FormRoleDTO, roleId?: string) {
    return this.dataSource.transaction(async (manager) => {
      const permissionRepo = manager.getRepository(Permission);
      const roleRepo = manager.getRepository(Role);

      const role = (await roleRepo.findOneBy({ id: roleId })) || new Role();

      const isDuplicate = await roleRepo.findOneBy({
        ...(roleId && { id: Not(roleId) }),
        name: formData.name,
      });
      if (isDuplicate)
        throw new ConflictException('Role name is already taken, please user a different one');

      const permissions = await permissionRepo.find({
        where: { id: In(formData.permissionIds) },
        select: ['id'],
      });
      if (permissions.length !== formData.permissionIds.length)
        throw new NotFoundException('Permissions not found, causing association failure.');

      role.permissions = formData.permissionIds.map((id) => Permission.builder().id(id).build());
      role.createdBy = role.createdBy || user;
      role.updatedBy = user;

      const roleData = roleRepo.merge(role, formData);

      return roleRepo.save(roleData);
    });
  }

  async findAllPaginated(config: PaginationDTO) {
    const { page = 1, pageSize = 10, search, sortBy = 'createdAt', sortOrder = 'asc' } = config;

    const [roles, count] = await this.roleRepo.findAndCount({
      ...(search && {
        where: { name: ILike(`%${search}%`) },
      }),
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { [sortBy]: sortOrder },
      relations: ['permissions', 'createdBy', 'updatedBy'],
    });

    return {
      total: count,
      totalPages: Math.ceil(count / pageSize),
      page,
      pageSize,
      items: roles,
    };
  }

  async findOne(id: string) {
    const doc = await this.roleRepo.findOne({
      where: { id },
      relations: { permissions: true, createdBy: true, updatedBy: true },
    });
    if (!doc) throw new NotFoundException('Role not found');

    return doc;
  }

  async remove(id: string) {
    const doc = await this.findOne(id);
    return this.roleRepo.remove(doc);
  }
}
