import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { FormPaymentChannelDTO } from './dto/form-payment-channel.dto';
import { User } from '../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Not, Repository } from 'typeorm';
import { PaymentChannel } from './entities/payment-channel.entity';
import { PaginationDTO } from 'src/schemas/paginate-query.dto';

@Injectable()
export class PaymentChannelService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,

    @InjectRepository(PaymentChannel)
    private channelRepo: Repository<PaymentChannel>,
  ) {}

  async createOrUpdate(user: User, formData: FormPaymentChannelDTO, channelId?: string) {
    const isDuplicate = await this.channelRepo.findOneBy({
      ...(channelId && { id: Not(channelId) }),
      name: formData.name,
    });
    if (isDuplicate) throw new ConflictException('Payment channel already exists');

    const createdBy = await this.userRepo.findOne({ where: { id: user.id } });

    const channel = (await this.channelRepo.findOneBy({ id: channelId })) || new PaymentChannel();
    channel.createdBy = channel?.createdBy || createdBy;
    channel.updatedBy = user;

    const channelData = this.channelRepo.merge(channel, formData);

    return this.channelRepo.save(channelData);
  }

  async findAllPaginated(config: PaginationDTO) {
    const { page = 1, pageSize = 10, search, sortBy = 'createdAt', sortOrder = 'asc' } = config;

    const [roles, count] = await this.channelRepo.findAndCount({
      ...(search && {
        where: { name: ILike(`%${search}%`) },
      }),
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { [sortBy]: sortOrder },
      relations: { createdBy: true, updatedBy: true },
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
    const doc = await this.channelRepo.findOne({
      where: { id },
      relations: { createdBy: true, updatedBy: true },
    });
    if (!doc) throw new NotFoundException('Role not found');

    return doc;
  }

  async remove(id: string) {
    const doc = await this.findOne(id);
    return this.channelRepo.remove(doc);
  }
}
