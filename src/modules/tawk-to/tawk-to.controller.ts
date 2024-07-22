import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { TawkToService } from './tawk-to.service';

@Controller('tawk-to')
export class TawkToController {
  constructor(private readonly tawkToService: TawkToService) {}

  @Get('properties')
  async getProperties() {
    const properties = await this.tawkToService.getProperties();
    return { data: properties };
  }

  @Get('property')
  async getProperty(@Query('propertyId') propertyId: string) {
    if (!propertyId) {
      throw new BadRequestException('propertyId is required');
    }
    const property = await this.tawkToService.getProperty(propertyId);
    return { data: property };
  }

}
