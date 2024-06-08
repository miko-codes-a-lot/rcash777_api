import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { FormPermissionDTO } from './dto/form-permission.dto';
import { Permission } from './entities/permission.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Not, Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { PaginationDTO } from 'src/schemas/paginate-query.dto';

@Injectable()
export class PermissionService  {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,

    @InjectRepository(Permission)
    private permissionRepo: Repository<Permission>
  ) {}

  async upsert (user: User, formData: FormPermissionDTO, permissionId?: string) {
    const { prevPermission, isDuplicate } = permissionId
      ? {
        prevPermission: await this.permissionRepo.findOne({ where: { id: permissionId } }),
        isDuplicate: await this.permissionRepo.findOne({ where: { id: Not(permissionId), code: formData.code } })
      }
      : { prevPermission: null, isDuplicate: null };

    if (isDuplicate) {
      throw new ConflictException('Permission code already in use, choose a different one');
    }

    const createdBy = await this.userRepo.findOne({ where: { id: user.id } })

    const permission = new Permission();

    permission.id = permissionId
    permission.name = formData.name
    permission.code = formData.code
    permission.description = formData.description

    permission.createdBy = prevPermission?.createdBy || createdBy
    permission.updatedBy = user

    const result = await this.permissionRepo.upsert(permission, ['code']);

    return result.generatedMaps[0]
  }

  async findAllPaginated(config: PaginationDTO) {
    const { page = 1, pageSize = 10, search, sortBy = 'createdAt', sortOrder = 'asc' } = config

    const [permissions, count] = await this.permissionRepo.findAndCount({
      ...(search && {
        where: [
          { code: ILike(`%${search}%`) },
          { name: ILike(`%${search}%`) }
        ]
      }),
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { [sortBy]: sortOrder },
      relations: ['role', 'createdBy', 'updatedBy']
    })

    return {
      total: count,
      totalPages: Math.ceil(count / pageSize),
      page,
      pageSize,
      items: permissions
    }
  }

  async findOne(id: string) {
    const doc = await this.permissionRepo.findOne({ where: { id }, relations: ['role', 'createdBy', 'updatedBy'] });
    if (!doc) throw new NotFoundException('Permission not found');

    return doc;
  }

  async remove(id: string) {
    const doc = await this.findOne(id)
    return this.permissionRepo.remove(doc)
  }
}
