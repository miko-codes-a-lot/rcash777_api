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
import { v4 as uuidv4 } from 'uuid';

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
    const tawkData = this.tawkRepository.merge(new UserTawk(), tawkto);
    tawkData.id = user.tawkto?.id;

    const tawk = await this.tawkRepository.save(tawkData);
    user.tawkto = tawk;

    return tawk;
  }

  private _validateOwner(isOwner: boolean) {
    if (isOwner) {
      throw new BadRequestException('There can only be one Owner');
    }
  }

  private _validateRole(user: User, data: any) {
    if (user.isOwner && (!data.isCityManager || !data.isAdmin)) {
      throw new BadRequestException('Owner can only create City Manager or Admin');
    } else if (user.isCityManager && !data.isMasterAgent) {
      throw new BadRequestException('City Manager can only create Master Agent');
    } else if (user.isMasterAgent && !data.isAgent) {
      throw new BadRequestException('Master Agent can only create Agent');
    } else if (user.isAgent && !data.isPlayer) {
      throw new BadRequestException('Agent can only create player');
    }
  }

  /**
   * CM 50-100
   * MA 40-45
   * A 30-35
   */
  private floorAndCeilCommission(user: User, commission: number) {
    if (user.isOwner && commission < 100) {
      throw new BadRequestException('Owner must have a shareable commission of 100');
    } else if (user.isCityManager && (commission < 50 || commission > 100)) {
      throw new BadRequestException('City Manager commission must be between 50 to 100');
    } else if (user.isMasterAgent && (commission < 40 || commission > 45)) {
      throw new BadRequestException('Master Agent commission must be between 40 to 45');
    } else if (user.isAgent && (commission < 30 || commission > 35)) {
      throw new BadRequestException('Agent commission must be between 30 to 35');
    }
  }

  async create(creator: User, data: PostUserNewRequest) {
    const user = new User();

    this._validateOwner(data.isOwner);
    this._validateRole(user, data);

    user.id = uuidv4();
    user.email = data.email;
    user.firstName = data.firstName;
    user.lastName = data.lastName;
    user.phoneNumber = data.phoneNumber;
    user.address = data.address;
    user.commission = data.isPlayer ? 0 : data.commission;
    user.rebate = !data.isPlayer ? 0 : data.rebate;
    user.password = bcrypt.hashSync(data.password, 10);
    user.parent = creator;

    await this.floorAndCeilCommission(user, data.commission);

    user.isAdmin = data.isAdmin;
    user.isCityManager = data.isCityManager;
    user.isMasterAgent = data.isMasterAgent;
    user.isAgent = data.isAgent;
    user.isPlayer = data.isPlayer;

    try {
      if (data.tawkto && data.tawkto?.propertyId) {
        await this._assignTawkTo(user, data.tawkto);
      }

      await this.treeUserRepo.save(user);
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
    this._validateRole(user, data);
    await this.floorAndCeilCommission(user, data.commission);

    user.firstName = data.firstName || user.firstName;
    user.lastName = data.lastName || user.lastName;
    user.phoneNumber = data.phoneNumber || user.phoneNumber;
    user.address = data.address || user.address;
    user.updatedBy = updater;
    user.commission = data.isPlayer ? 0 : data.commission || user.commission;
    user.rebate = !data.isPlayer ? 0 : data.rebate || user.rebate;

    user.isAdmin = data.isAdmin;
    user.isCityManager = data.isCityManager;
    user.isMasterAgent = data.isMasterAgent;
    user.isAgent = data.isAgent;
    user.isPlayer = data.isPlayer;
    user.isActivated = data.isActivated

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
      relations: { tawkto: true },
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

  async getSelf(id: string) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });
    const parents = await this.treeUserRepo.findAncestors(user, { relations: ['tawkto'] });
    const cm = parents.find((u) => u.isCityManager);
    if (cm) {
      user.tawkto = cm.tawkto;
    }
    return user;
  }

  async findAllUserPaginate(pagination: Pagination): Promise<PaginationResponse<User>> {
    return await super.findAllPaginate(pagination, {
      fields: ['phoneNumber', 'address'],
    });
  }
}
