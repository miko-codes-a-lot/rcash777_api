import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { GameDTO } from './dto/game.dto';
import { DataSource, ILike, In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { GameImage } from './entities/game-image.entity';
import { GamePaginationDTO, TopGameDTO } from 'src/schemas/paginate-query.dto';
import { HttpService } from '@nestjs/axios';
import { ProviderDTO } from './dto/provider.dto';
import { Provider } from './entities/provider.entity';

@Injectable()
export class GameService {
  private readonly logger = new Logger(GameService.name);

  constructor(
    private dataSource: DataSource,
    private readonly http: HttpService,

    @InjectRepository(Game)
    private gameRepo: Repository<Game>,

    @InjectRepository(Provider)
    private providerRepo: Repository<Provider>,
  ) {}

  createManyProviders(providers: ProviderDTO[]) {
    return this.dataSource.transaction(async (manager) => {
      const providerRepo = manager.getRepository(Provider);
      for (const providerDTO of providers) {
        this.logger.debug(`saving provider ${providerDTO.clientCode}`);
        const provider =
          (await providerRepo.findOne({ where: { id: providerDTO.id } })) || new Provider();

        provider.id = providerDTO.id;
        provider.code = providerDTO.clientCode;
        provider.name = providerDTO.displayName;
        provider.icon = providerDTO.logos.base;
        provider.isActive = true;

        await providerRepo.save(provider);
      }
    });
  }

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
        game.isActive = true;

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

  async findAllProviders() {
    return this.providerRepo.find({ where: { isActive: true } });
  }

  async findTop(config: TopGameDTO) {
    const { category } = config;
    const games = {
      SLOT: [
        'JIL_SUPER_ACE',
        'JIL_FORTUNE_GEMS',
        'FCI_LUCKY_FORTUNES',
        'PP_SWEET_BONANZA_1000',
        'PP_SUGAR_RUSH_1000',
        'PP_GATES_OF_OLYMPUS_1000',
        'PP_SWEET_BONANZA',
        'PP_STARLIGHT_PRINCESS_1000',
        'JIL_SUPER_ACE',
        'JIL_SUPER_ACE_DELUXE',
        'JIL_MEGA_ACE',
        'JIL_FORTUNE_GEMS_2',
        'JIL_GOLDEN_EMPIRE',
        'PGS_WILD_BOUNTY_SHOWDOWN',
        'PGS_PINATA_WINS',
        'PGS_SHARK_HUNTER',
        'FCI_SUGAR_BANG_BANG',
        'FCI_LUCKY_FORTUNES',
        'FCI_CHINESE_NEW_YEAR_2',
        'FCI_LUCKY_FORTUNES_3X3',
        'FCI_GOLDEN_GENIE',
      ],
      POKER: [
        'JIL_BLACKJACK',
        'JIL_TONGITS',
        'JIL_TONGITS_GO',
        'HBN_THREE_CARD_POKER',
        'HBN_CARIBBEAN_HOLDEM',
        'JIL_BLACKJACK_LUCKY_LADIES',
        'JIL_VIDEO_POKER',
        'JIL_CARIBBEAN_STUD_POKER',
        'JIL_PUSOY_GO',
        'JIL_POKER_LOBBY',
      ],
      LIVE_CASINO_TABLE: ['EVO_CRAZY_TIME', 'EVO_LIGHTNING_STORM'],
      GAME_SHOWS: ['EVO_MEGA_BALL', 'EVO_MONOPOLY_LIVE'],
    }[category];

    if (!games) throw new BadRequestException('Category is not supported');

    return this.gameRepo.find({
      where: {
        isActive: true,
        isProviderInMaintenance: true,
        code: In(games),
        category,
      },
      relations: { images: true },
      take: games.length,
      order: { name: 1 },
    });
  }

  async findAllPaginated(config: GamePaginationDTO) {
    const {
      page = 1,
      pageSize = 10,
      search,
      category,
      providerCode,
      sortBy = 'name',
      sortOrder = 'asc',
    } = config;

    const [items, count] = await this.gameRepo.findAndCount({
      where: {
        isActive: true,
        isProviderInMaintenance: false,
        name: ILike(`%${search}%`),
        ...(category && { category }),
        ...(providerCode && { providerCode }),
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      relations: { images: true },
      order: { [sortBy]: sortOrder },
    });

    return {
      total: count,
      totalPages: Math.ceil(count / pageSize),
      page,
      pageSize,
      items,
    };
  }

  async findOne(id: string) {
    const game = await this.gameRepo.findOne({
      where: { id, isActive: true, isProviderInMaintenance: false },
    });
    if (!game) {
      throw new NotFoundException('Game not found');
    }
    return game;
  }

  async cleanupProviders(activeProviderCodes: string[]) {
    const providers = await this.findAllProviders();
    const currentProviderCodes = providers.map((provider) => provider.code);

    const codesToDeactivate = currentProviderCodes.filter(
      (code) => !activeProviderCodes.includes(code),
    );

    if (codesToDeactivate.length > 0) {
      await this.providerRepo.update(
        { code: In(codesToDeactivate), isActive: true },
        { isActive: false },
      );
    }

    return true;
  }

  async cleanupGames(activeProviderCodes: string[]) {
    const games = await this.gameRepo.find();
    const currentGameCodes = games.map((provider) => provider.code);

    const codesToDeactivate = currentGameCodes.filter(
      (code) => !activeProviderCodes.includes(code),
    );

    if (codesToDeactivate.length > 0) {
      await this.gameRepo.update(
        { code: In(codesToDeactivate), isActive: true },
        { isActive: false },
      );
    }

    return true;
  }
}
