import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { GameDTO } from './dto/game.dto';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { GameImage } from './entities/game-image.entity';
import { PaginationDTO } from 'src/schemas/paginate-query.dto';

@Injectable()
export class GameService {
  private readonly logger = new Logger(GameService.name);

  constructor(
    private dataSource: DataSource,

    @InjectRepository(Game)
    private gameRepo: Repository<Game>,
  ) {}

  createMany(games: GameDTO[]) {
    return this.dataSource.transaction(async (manager) => {
      const gameRepo = manager.getRepository(Game);
      const imageRepo = manager.getRepository(GameImage);

      for (const gameDTO of games) {
        this.logger.debug(`saving game ${gameDTO.gameCode}`);

        const game = (await gameRepo.findOne({ where: { code: gameDTO.gameCode } })) || new Game();

        game.code = gameDTO.gameCode;
        game.category = gameDTO.gameCategory;

        game.name = gameDTO.gameName;
        game.code = gameDTO.gameCode;
        game.category = gameDTO.gameCategory;
        game.providerCode = gameDTO.providerCode;
        game.isProviderInMaintenance = gameDTO.isProviderInMaintenance;
        game.jackpotClass = gameDTO.jackpotClass;
        game.jackpotContribution = gameDTO.jackpotContribution;
        game.isDemoAllowed = gameDTO.isDemoAllowed;
        game.isFreeroundSupported = gameDTO.isFreeroundSupported;
        game.rtp = gameDTO.rtp;

        await gameRepo.save(game);

        // delete images that are no longer present
        const resolutions = Object.keys(gameDTO.images);

        if (resolutions.length > 0) {
          // delete images that are not present in resolutions
          await imageRepo
            .createQueryBuilder()
            .delete()
            .from(GameImage)
            .where('game_id = :gameId', { gameId: game.id })
            .andWhere('resolution NOT IN (:...resolutions)', { resolutions })
            .execute();
        } else {
          // delete all resolutions because it's now empty
          await imageRepo
            .createQueryBuilder()
            .delete()
            .from(GameImage)
            .where('game_id = :gameId', { gameId: game.id })
            .execute();
        }

        const saveImages = Object.entries(gameDTO.images).map(async ([k, v]) => {
          this.logger.debug(`saving game ${gameDTO.gameCode} image "${k}"...`);
          const image =
            (await imageRepo.findOne({
              where: { game: { id: game.id }, resolution: k },
            })) || new GameImage();

          image.resolution = k;
          image.uri = v;
          image.game = game;

          return imageRepo.save(image);
        });

        const images = await Promise.all(saveImages);

        game.images = images;

        this.logger.debug(`finalizing save game ${gameDTO.gameCode}`);
        await gameRepo.save(game);
      }
    });
  }

  async findAllPaginated(config: PaginationDTO) {
    const { page = 1, pageSize = 10, sortBy = 'name', sortOrder = 'asc' } = config;

    const [tx, count] = await this.gameRepo.findAndCount({
      relations: { images: true },
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { [sortBy]: sortOrder },
    });

    return {
      total: count,
      totalPages: Math.ceil(count / pageSize),
      page,
      pageSize,
      items: tx,
    };
  }

  async findOne(id: string) {
    const game = await this.gameRepo.findOne({ where: { id } });
    if (!game) {
      throw new NotFoundException('Game not found');
    }
    return game;
  }
}
