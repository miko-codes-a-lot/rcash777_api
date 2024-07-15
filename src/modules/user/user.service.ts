import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { ILike, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Pagination, PaginationResponse } from 'src/schemas/pagination.schema';
import { BaseService } from 'src/services/base.service';
import { PostUserNewRequest } from './schemas/post-user-new.schema';
import { PostUserUpdateRequest } from './schemas/put-user-update.schema';
import { PaginationDTO } from 'src/schemas/paginate-query.dto';
import { UserTawk } from './entities/user-tawk.entity';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(UserTawk) private tawkRepository: Repository<UserTawk>,
  ) {
    super();
    this.repository = userRepository;
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

  async create(creator: User, data: PostUserNewRequest) {
    const user = new User();

    user.email = data.email;
    user.firstName = data.firstName;
    user.lastName = data.lastName;
    user.phoneNumber = data.phoneNumber;
    user.address = data.address;
    user.password = bcrypt.hashSync(data.password, 10);
    user.createdBy = creator;

    try {
      await this.userRepository.save(user);

      if (data.tawkto) {
        await this._assignTawkTo(user, data.tawkto);
      }

      return user;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: string, updater: User, data: PostUserUpdateRequest) {
    const user = await this.findById(id, { tawkto: true });

    user.firstName = data.firstName || user.firstName;
    user.lastName = data.lastName || user.lastName;
    user.phoneNumber = data.phoneNumber || user.phoneNumber;
    user.address = data.address || user.address;
    user.updatedBy = updater;

    if (data.tawkto) {
      await this._assignTawkTo(user, data.tawkto);
    }

    return this.userRepository.save(user);
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }

  async findAllPaginated(config: PaginationDTO) {
    const { page = 1, pageSize = 10, search, sortBy = 'createdAt', sortOrder = 'asc' } = config;

    const [users, count] = await this.userRepository.findAndCount({
      ...(search && {
        where: [
          { email: ILike(`%${search}%`) },
          { firstName: ILike(`%${search}%`) },
          { lastName: ILike(`%${search}%`) },
          { phoneNumber: ILike(`%${search}%`) },
        ],
      }),
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
