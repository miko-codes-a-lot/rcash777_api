import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserTawk } from './entities/user-tawk.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserTawk])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
