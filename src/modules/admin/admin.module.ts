import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { UserTawk } from '../user/entities/user-tawk.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserTawk])],
  controllers: [AdminController],
  providers: [AdminService, UserService],
})
export class AdminModule {}
