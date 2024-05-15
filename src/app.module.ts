import { AuthModule } from './modules/auth/auth.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/users/users.module';
import { dataSourceOptions } from 'db/data-source';

@Module({
  imports: [TypeOrmModule.forRoot(dataSourceOptions), AuthModule, UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
