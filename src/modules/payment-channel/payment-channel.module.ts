import { Module } from '@nestjs/common';
import { PaymentChannelService } from './payment-channel.service';
import { PaymentChannelController } from './payment-channel.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { PaymentChannel } from './entities/payment-channel.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, PaymentChannel])],
  controllers: [PaymentChannelController],
  providers: [PaymentChannelService],
})
export class PaymentChannelModule {}
