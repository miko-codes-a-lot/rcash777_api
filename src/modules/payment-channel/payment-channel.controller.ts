import { Controller, Get, Post, Body, Param, Res, Put, Query } from '@nestjs/common';
import { PaymentChannelService } from './payment-channel.service';
import { FormPaymentChannelDTO, PaymentChannelSchema } from './dto/form-payment-channel.dto';
import { AuthRequired } from 'src/decorators/auth-required.decorator';
import { ApiTags } from '@nestjs/swagger';
import { Validate } from 'src/decorators/validate.decorator';
import { User } from '../user/entities/user.entity';
import { RequestUser } from 'src/decorators/request-user.decorator';
import { HttpStatus } from 'src/enums/http-status.enum';
import { Response } from 'express';
import { PaginationDTO } from 'src/schemas/paginate-query.dto';

@AuthRequired()
@ApiTags('payment-channel')
@Controller('payment-channel')
export class PaymentChannelController {
  constructor(private readonly channelService: PaymentChannelService) {}

  @Post()
  @Validate({ body: PaymentChannelSchema })
  async create(
    @RequestUser() user: User,
    @Body() createPaymentChannelDto: FormPaymentChannelDTO,
    @Res() res: Response,
  ) {
    const doc = await this.channelService.createOrUpdate(user, createPaymentChannelDto);
    return res.status(HttpStatus.CREATED).json(doc);
  }

  @Get()
  async findAll(@Query() query: PaginationDTO) {
    query.page *= 1;
    query.pageSize *= 1;

    return await this.channelService.findAllPaginated(query);
  }

  @Get('options')
  async getOptions() {
    return await this.channelService.getOptions();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.channelService.findOne(id);
  }

  @Put(':id')
  @Validate({ body: PaymentChannelSchema })
  async update(
    @Param('id') id: string,
    @RequestUser() user: User,
    @Body() formData: FormPaymentChannelDTO,
  ) {
    return await this.channelService.createOrUpdate(user, formData, id);
  }

  // @Delete(':id')
  // async remove(@Param('id') id: string, @Res() res: Response) {
  //   await this.channelService.remove(id);
  //   return res.status(HttpStatus.NO_CONTENT).send();
  // }
}
