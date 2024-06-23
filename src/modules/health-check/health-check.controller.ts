import { Controller, Get, Res } from '@nestjs/common';
import { HttpStatus } from 'src/enums/http-status.enum';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';

@Controller('health-check')
@ApiTags('health-check')
export class HealthCheckController {
  @Get()
  get(@Res() res: Response) {
    res.status(HttpStatus.SUCCESS).json({ message: 'OK' });
  }
}
