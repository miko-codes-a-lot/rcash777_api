import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { GameService } from './game.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { GameDTO } from './dto/game.dto';

@Injectable()
export class GameSchedule {
  private readonly logger = new Logger(GameSchedule.name);

  constructor(
    private readonly http: HttpService,
    private gameService: GameService,
  ) {}

  // @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
  @Cron(CronExpression.EVERY_10_SECONDS, {
    name: 'get_games',
    timeZone: 'Asia/Singapore',
  })
  performTask() {
    this.logger.debug('hello world from cron!');
    // this.http.get('https://zenith-fusion-stage.nextralgaming.com/public/v1/gameList').subscribe({
    //   next: (response) => {
    //     const games: GameDTO[] = response.data;
    //     this.gameService.createMany(games);
    //   },
    // });
  }
}
