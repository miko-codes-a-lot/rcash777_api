import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { GameService } from './game.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { GameDTO } from './dto/game.dto';
import config from '../../config/config';
import { zip } from 'rxjs';
import { ProviderDTO } from './dto/provider.dto';

const NEXTRAL_URI = config.game_api.zenith.uri;

@Injectable()
export class GameSchedule {
  private readonly logger = new Logger(GameSchedule.name);

  constructor(
    private readonly http: HttpService,
    private gameService: GameService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
    name: 'get_games',
    timeZone: 'Asia/Singapore',
  })
  async performTask() {
    this.logger.debug('Retrieving games in cron!');
    return zip([
      this.http
        .get(`${NEXTRAL_URI}/lobby/v1/clients`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${config.game_api.zenith.operation.basic}`,
          },
        })
        .subscribe({
          next: async (response) => {
            const providers: ProviderDTO[] = response.data;
            await this.gameService.createManyProviders(providers);
          },
          error: (err) => console.error(err, 'error'),
        }),
      this.http
        .get(`${NEXTRAL_URI}/public/v1/gameList`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${config.game_api.zenith.operation.basic}`,
          },
        })
        .subscribe({
          next: async (response) => {
            const games: GameDTO[] = response.data;
            await this.gameService.createMany(games);
          },
        }),
    ]);
  }
}
