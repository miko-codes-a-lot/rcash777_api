import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [AdminController],
  providers: [AdminService, UserService],
})
export class AdminModule {}
