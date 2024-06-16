import { Controller, Get, Param, Query } from '@nestjs/common';
import { GameService } from './game.service';
import { PaginationDTO } from 'src/schemas/paginate-query.dto';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get()
  async findAll(@Query() query: PaginationDTO) {
    return await this.gameService.findAllPaginated(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.gameService.findOne(id);
  }
}
