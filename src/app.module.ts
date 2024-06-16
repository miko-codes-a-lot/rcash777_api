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
import { PaymentChannelModule } from './modules/payment-channel/payment-channel.module';
import { CashTransactionModule } from './modules/cash-transaction/cash-transaction.module';
import { CoinTransactionModule } from './modules/coin-transaction/coin-transaction.module';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';
import { GameModule } from './modules/game/game.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    ScheduleModule.forRoot(),
    HttpModule,
    AdminModule,
    AuthModule,
    HealthCheckModule,
    UserModule,
    RoleModule,
    PermissionModule,
    PaymentChannelModule,
    CashTransactionModule,
    CoinTransactionModule,
    GameModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: DefaultResponseStatus,
    },
  ],
})
export class AppModule {}
