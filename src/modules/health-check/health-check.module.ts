import { HealthCheckController } from './health-check.controller';
import { Module } from '@nestjs/common';

@Module({
  controllers: [HealthCheckController],
})
export class HealthCheckModule {}
