import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TawkToService } from './tawk-to.service';
import { TawkToController } from './tawk-to.controller';

@Module({
  imports: [HttpModule],
  controllers: [TawkToController],
  providers: [TawkToService],
})
export class TawkToModule {}
