import { Controller, Get, Res } from '@nestjs/common';
import { EResponse } from 'src/enums/response.enum';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';

@Controller('health-check')
@ApiTags('health-check')
export class HealthCheckController {
  @Get()
  get(@Res() res: Response) {
    res.status(EResponse.SUCCESS).json({ message: 'OK' });
  }
}
