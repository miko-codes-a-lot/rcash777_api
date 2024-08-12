import { Cron, CronExpression } from '@nestjs/schedule';
import { Injectable, Logger } from '@nestjs/common';

import { GameDTO } from './dto/game.dto';
import { GameService } from './game.service';
import { HttpService } from '@nestjs/axios';
import { ProviderDTO } from './dto/provider.dto';
import config from '../../config/config';
import { zip } from 'rxjs';

const NEXTRAL_URI = config.game_api.zenith.uri;
const exclusions = ['PLAYNGO'];

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
        .get(`${NEXTRAL_URI}/lobby/v2/clients`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${config.game_api.zenith.operation.basic}`,
          },
        })
        .subscribe({
          next: async (response) => {
            const providers: ProviderDTO[] = response.data.filter(
              (provider: ProviderDTO) => !exclusions.includes(provider.clientCode),
            );

            await this.gameService.createManyProviders(providers);

            const activeProviderCodes = response.data.map((item) => item.clientCode);
            await this.gameService.cleanupProviders(activeProviderCodes);
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
            const games: GameDTO[] = response.data.filter(
              (game: GameDTO) => !exclusions.includes(game.providerCode),
            );
            await this.gameService.createMany(games);

            const activeGameCodes = response.data.map((item) => item.gameCode);
            await this.gameService.cleanupGames(activeGameCodes);
          },
        }),
    ]);
  }
}
