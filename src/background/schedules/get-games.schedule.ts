import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AxiosResponse } from 'axios';
import { GameDTO } from 'src/modules/game/dto/game.dto';

@Injectable()
export class GetGamesSchedule {
  private readonly logger = new Logger(GetGamesSchedule.name);

  constructor(private readonly http: HttpService) {}

  // @Cron(CronExpression.EVERY_10_SECONDS, {
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
    name: 'get_games',
    timeZone: 'Asia/Singapore',
  })
  performTask() {
    this.logger.debug('hello world from cron!');
    this.http
      .get<
        AxiosResponse<GameDTO[]>
      >('https://zenith-fusion-stage.nextralgaming.com/public/v1/gameList')
      .subscribe({
        next: (games) => {
          console.log(games);
        },
      });
  }
}
