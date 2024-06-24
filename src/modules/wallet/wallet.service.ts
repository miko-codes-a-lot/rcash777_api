import { HttpException, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CoinTransaction } from '../coin-transaction/entities/coin-transaction.entity';
import { User } from '../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from '../game/entities/game.entity';
import { FormDebitDTO } from './dto/form-debit.dto';
import { HttpStatus } from 'src/enums/http-status.enum';
import { CoinTransactionService } from '../coin-transaction/coin-transaction.service';
import { TransactionType } from 'src/enums/transaction.enum';

@Injectable()
export class WalletService {
  constructor(
    private dataSource: DataSource,
    private coinService: CoinTransactionService,

    @InjectRepository(CoinTransaction)
    private coinRepo: Repository<CoinTransaction>,

    @InjectRepository(User)
    private userRepo: Repository<User>,

    @InjectRepository(Game)
    private gameRepo: Repository<Game>,
  ) {}

  async findOne<T>(
    repo: Repository<T>,
    query: any,
    error: { errorCode: string; errorMessage: string },
  ) {
    const data = await repo.findOne({ where: query });
    if (!data) {
      throw new HttpException({ error }, HttpStatus.NOT_FOUND);
    }
    return data;
  }

  // remove money from player balance (credit on our DB)
  // @TODO: 2024-06-24 - Implement later "ROUND_NOT_FOUND", "ROUND_ENDED"
  async debit(data: FormDebitDTO) {
    if (data.currency !== 'PHP') {
      throw new HttpException(
        {
          error: {
            errorCode: 'INVALID_CURRENCY',
            errorMessage: 'Currency not supported or invalid',
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const remainingBalance = await this.coinService.computeBalance(data.player);
    if (remainingBalance - data.amount <= 0) {
      throw new HttpException(
        { currency: 'PHP', balance: remainingBalance },
        HttpStatus.PAYMENT_REQUIRED,
      );
    }

    const player = await this.findOne<User>(
      this.userRepo,
      { id: data.player },
      { errorCode: 'PLAYER_NOT_FOUND', errorMessage: 'Player not found' },
    );

    const game = await this.findOne<Game>(
      this.gameRepo,
      { code: data.game },
      { errorCode: 'GAME_NOT_FOUND', errorMessage: 'Game not found' },
    );

    const txCredit = CoinTransaction.builder()
      .id(data.transId)
      .player(player)
      .roundId(data.roundId)
      .game(game)
      .type(TransactionType.CREDIT)
      .typeCategory(data.reason)
      .amount(data.amount)
      .createdBy(player)
      .build();

    await this.coinRepo.save(txCredit);

    return remainingBalance + txCredit.amount;
  }
}
