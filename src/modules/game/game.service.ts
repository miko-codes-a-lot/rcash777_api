import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { GameDTO } from './dto/game.dto';
import { DataSource, ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { GameImage } from './entities/game-image.entity';
import { GamePaginationDTO } from 'src/schemas/paginate-query.dto';
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
        provider.icon = providerDTO.icon;

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
    return this.providerRepo.find();
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

    const [tx, count] = await this.gameRepo.findAndCount({
      where: {
        name: ILike(`%${search}%`),
        ...(category && { category }),
        ...(providerCode && { providerCode }),
      },
      relations: { images: true },
      order: { [sortBy]: sortOrder },
    });

    const topGamesCode = [
      'PP_SWEET_BONANZA','PP_WILD_WEST_GOLD','PNG_15_CRYSTAL_ROSES_A_TALE_OF_LOVE',
      'HCK_2WILD2DIE',,'WMS_50S_PINUP_HD','JIL_7_UPDOWN',
      'PP_RELEASE_THE_KRAKEN','MNP_FORTUNE_DRAGON_2', 'FCI_FORTUNE_KOI',
      'BMG_BURNING_CLASSICS_GO_WILD','PP_3_BUZZING_WILDS', 'PGS_CAPTAINS_BOUNTY',
      'PP_BUBBLE_POP','JIL_TONGITS', 'JIL_TONGITS_GO',
      'JIL_BLACKJACK','JIL_PUSOY_GO', 'JIL_ANDAR_BAHAR','JIL_LUDO_QUICK', 
      'JIL_LUDO_QUICK','JIL_BLACKJACK_LUCKY_LADIES', 'JIL_TEENPATTI_2020',
      'JIL_TEENPATTI','JIL_POOL_RUMMY', 'JIL_MINI_FLUSH','JIL_7_UP_7_DOWN',
      'JIL_BACCARAT', 'PGS_BACCARAT_DELUXE', 'JIL_MAGIC_LAMP_BINGO', 'JIL_POKER_KING',
      'JIL_BIG_SMALL', 'JIL_BINGO_EMPIRE', 'JIL_COLOR_GAME', 'JIL_DRAGON_AND_TIGER',
      'JIL_GO_RUSH', 'JIL_KENO', 'JIL_MAGIC_LAMP_BINGO','JIL_WHEEL',
      'PP_DARTS','PP_FANTASTIC_LEAGUE_FOOTBALL','PP_FLAT_HORSE_RACING',
      'PP_FORCE_1_RACING','PP_GREYHOUND_RACING','PP_STEEPLECHASE',
      'PP_AMERICAN_BLACKJACK','SAG_LIVE_BACCARAT','PP_BACCARAT',
      'PP_BACCARAT_LOBBY','PP_VIP_ROULETTE_THE_CLUB','PP_BLACKJACK_LOBBY',
      'SAG_LIVE_FAN_TAN','PP_MEGA_ROULETTE','PP_MULTIHAND_BLACKJACK',
      'SAG_LIVE_SEXY_ROULETTE','PP_POWER_BALL', 'PP_ROULETTE',
      'PP_TREASURE_ISLAND','PP_DIAMOND_STRIKE_100000','PP_WOLF_GOLD_1_MILLION',
      'PP_HOT_SAFARI_50000', 'PP_PANDA_GOLD_10000', 'PP_QUEEN_OF_GOLD_100000',
      'PP_7_PIGGIES_5000','PP_HOT_SAFARI_50000', 'PP_GOLD_RUSH_250000',
      'PP_QUEEN_OF_GOLD_100000','SAG_LIVE_LOBBY','EVO_ROULETTE',
      'EVO_LIVE_BACCARAT','EVO_LIVE_LOBBY','EVO_LIVE_BLACKJACK',
      'EVO_LIVE_GAME_SHOWS','JIL_ALLSTAR_FISHING','FCI_BAO_CHUAN_FISHING',
      'WMS_THREE_KINGDOMS_OF_FISHING', 'GMT_PIXIEMAGIC_COLOR_GAME',
      'FCI_GODS_GRANT_FORTUNE','JIL_DINOSAUR_TYCOON_II','JIL_JACK_POT_FISHING',
      'JIL_OCEAN_KING_JACKPOT', 'FCI_STAR_HUNTER', 'FCI_MONKEY_KING_FISHING', 
      'JIL_BOOM_LEGEND', 'JIL_DRAGON_FORTUNE'
    ];

    const topGames = tx.filter(item => topGamesCode.includes(item.code));;
    const normalGames = tx.filter(item => !topGamesCode.includes(item.code));
    const sortedGames = [
      ...topGames,
      ...normalGames
    ];

    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const gameList = sortedGames.slice(startIndex, endIndex);

    return {
      total: count,
      totalPages: Math.ceil(count / pageSize),
      page,
      pageSize,
      items: gameList,
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
