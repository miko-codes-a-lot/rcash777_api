import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { GameImage } from './entities/game-image.entity';
import { GameSchedule } from './game.schedule';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([Game, GameImage]), HttpModule.register({})],
  controllers: [GameController],
  providers: [GameService, GameSchedule],
})
export class GameModule {}
