import { APP_INTERCEPTOR } from '@nestjs/core';
import { AdminModule } from './modules/admin/admin.module';
import { AuthModule } from './modules/auth/auth.module';
import { DefaultResponseStatus } from './interceptors/default-response-status.interceptor';
import { HealthCheckModule } from './modules/health-check/health-check.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { dataSourceOptions } from 'db/data-source';
import { PermissionModule } from './modules/permission/permission.module';
import { RoleModule } from './modules/role/role.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    AdminModule,
    AuthModule,
    HealthCheckModule,
    UserModule,
    RoleModule,
    PermissionModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: DefaultResponseStatus,
    },
  ],
})
export class AppModule { }
