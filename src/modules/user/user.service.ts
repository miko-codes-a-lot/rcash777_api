import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { DataSource, ILike, In, Repository, TreeRepository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Pagination, PaginationResponse } from 'src/schemas/pagination.schema';
import { BaseService } from 'src/services/base.service';
import { PostUserNewRequest } from './schemas/post-user-new.schema';
import { PostUserUpdateRequest } from './schemas/put-user-update.schema';
import { UserPaginateDTO } from 'src/schemas/paginate-query.dto';
import { UserTawk } from './entities/user-tawk.entity';

@Injectable()
export class UserService extends BaseService<User> {
  private treeUserRepo: TreeRepository<User>;

  constructor(
    private dataSource: DataSource,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(UserTawk) private tawkRepository: Repository<UserTawk>,
  ) {
    super();
    this.repository = userRepository;
    this.treeUserRepo = dataSource.manager.getTreeRepository(User);
  }

  private async _assignTawkTo(user: User, tawkto: { propertyId: string; widgetId: string }) {
    const tawk = user.tawkto || new UserTawk();
    tawk.propertyId = tawkto.propertyId;
    tawk.widgetId = tawkto.widgetId;
    tawk.users = [user];

    delete tawk.users;

    await this.tawkRepository.save(tawk);
    user.tawkto = tawk;

    return tawk;
  }

  private _validateOwner(isOwner: boolean) {
    if (isOwner) {
      throw new BadRequestException('There can only be one Owner');
    }
  }

  async create(creator: User, data: PostUserNewRequest) {
    const user = new User();

    this._validateOwner(data.isOwner);

    user.email = data.email;
    user.firstName = data.firstName;
    user.lastName = data.lastName;
    user.phoneNumber = data.phoneNumber;
    user.address = data.address;
    user.password = bcrypt.hashSync(data.password, 10);
    user.parent = creator;

    user.isAdmin = data.isAdmin;
    user.isCityManager = data.isCityManager;
    user.isMasterAgent = data.isMasterAgent;
    user.isAgent = data.isAgent;
    user.isPlayer = data.isPlayer;

    try {
      await this.treeUserRepo.save(user);

      if (data.tawkto && data.tawkto?.propertyId) {
        await this._assignTawkTo(user, data.tawkto);
      }

      return user;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updateSelf(id: string, updater: User, data: PostUserUpdateRequest) {
    const user = await this.findById(id, { tawkto: true });

    user.firstName = data.firstName || user.firstName;
    user.lastName = data.lastName || user.lastName;
    user.phoneNumber = data.phoneNumber || user.phoneNumber;
    user.address = data.address || user.address;
    user.updatedBy = updater;

    return this.treeUserRepo.save(user);
  }

  async update(id: string, updater: User, data: PostUserUpdateRequest) {
    const user = await this.findById(id, { tawkto: true });
    if (!user) throw new NotFoundException('User not found');

    this._validateOwner(data.isOwner);

    user.firstName = data.firstName || user.firstName;
    user.lastName = data.lastName || user.lastName;
    user.phoneNumber = data.phoneNumber || user.phoneNumber;
    user.address = data.address || user.address;
    user.updatedBy = updater;

    user.isAdmin = data.isAdmin;
    user.isCityManager = data.isCityManager;
    user.isMasterAgent = data.isMasterAgent;
    user.isAgent = data.isAgent;
    user.isPlayer = data.isPlayer;

    if (data.tawkto) {
      await this._assignTawkTo(user, data.tawkto);
    }

    return this.treeUserRepo.save(user);
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }

  private async _findDescendantsId(user: User) {
    const children = await this.treeUserRepo.findDescendants(user);
    return children.map((u) => u.id);
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: { tawkto: true }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findAllPaginated(user: User, config: UserPaginateDTO) {
    const {
      page = 1,
      pageSize = 10,
      search,
      role,
      sortBy = 'createdAt',
      sortOrder = 'asc',
    } = config;

    const ids = await this._findDescendantsId(user);

    const [users, count] = await this.userRepository.findAndCount({
      where: [
        {
          email: ILike(`%${search}%`),
          ...(role && { [role]: true }),
          parent: { id: In(ids) },
        },
        {
          firstName: ILike(`%${search}%`),
          ...(role && { [role]: true }),
          parent: { id: In(ids) },
        },
        {
          lastName: ILike(`%${search}%`),
          ...(role && { [role]: true }),
          parent: { id: In(ids) },
        },
        {
          phoneNumber: ILike(`%${search}%`),
          ...(role && { [role]: true }),
          parent: { id: In(ids) },
        },
      ],
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { [sortBy]: sortOrder },
    });

    return {
      total: count,
      totalPages: Math.ceil(count / pageSize),
      page,
      pageSize,
      items: users,
    };
  }

  getSelf(id: string) {
    return this.userRepository.findOne({
      where: {
        id,
      },
      relations: {
        tawkto: true,
      },
    });
  }

  async findAllUserPaginate(pagination: Pagination): Promise<PaginationResponse<User>> {
    return await super.findAllPaginate(pagination, {
      fields: ['phoneNumber', 'address'],
    });
  }
}
