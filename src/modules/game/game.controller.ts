import { Body, Controller, Get, Param, Post, Query, Res } from '@nestjs/common';
import { GameService } from './game.service';
import { GamePaginationDTO } from 'src/schemas/paginate-query.dto';
import { AuthRequired } from 'src/decorators/auth-required.decorator';
import { Validate } from 'src/decorators/validate.decorator';
import { FormLaunchGameDTO, FormLaunchGameSchema } from './dto/form-launch-game.dto';
import { NextralService } from '../wallet/nextral.service';
import { RequestUser } from 'src/decorators/request-user.decorator';
import { User } from '../user/entities/user.entity';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { AuthHasAccess } from 'src/decorators/auth-has-access';

@ApiTags('game')
@Controller('game')
export class GameController {
  constructor(
    private readonly gameService: GameService,
    private readonly nextralService: NextralService,
  ) {}

  @AuthRequired()
  @AuthHasAccess(['isPlayer'])
  @Validate({ body: FormLaunchGameSchema })
  @Post('nextral/launch')
  async getURI(@RequestUser() user: User, @Body() data: FormLaunchGameDTO, @Res() res: Response) {
    const uri = await this.nextralService.launch(user, data);
    return uri.subscribe({
      next: (response) => res.json(response),
      error: (err) => console.error(err, 'error'),
    });
  }

  @Get()
  async findAll(@Query() query: GamePaginationDTO) {
    query.page *= 1;
    query.pageSize *= 1;

    return await this.gameService.findAllPaginated(query);
  }

  @Get('provider')
  async findAllProviders(@Query('category') category?: string) {
    return await this.gameService.findAllProviders(category);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.gameService.findOne(id);
  }
}
