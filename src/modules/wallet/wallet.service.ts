import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CoinTransaction } from '../coin-transaction/entities/coin-transaction.entity';
import { User } from '../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from '../game/entities/game.entity';
import { FormDebitDTO } from './dto/form-debit.dto';
import { HttpStatus } from 'src/enums/http-status.enum';
import { CoinTransactionService } from '../coin-transaction/coin-transaction.service';
import { TransactionType, TransactionTypeCategory } from 'src/enums/transaction.enum';
import { FormCreditDTO } from './dto/form-credit.dto';
import { FormRollbackDTO } from './dto/form-rollback.dto';
import { FormPayoutDTO } from './dto/form-payout.dto';

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

  private async _getPlayerAndGame(playerId: string, gameCode: string) {
    return Promise.all([
      this._findOne<User>(
        this.userRepo,
        { id: playerId },
        { errorCode: 'PLAYER_NOT_FOUND', errorMessage: 'Player not found' },
      ),
      this._findOne<Game>(
        this.gameRepo,
        { code: gameCode },
        { errorCode: 'GAME_NOT_FOUND', errorMessage: 'Game not found' },
      ),
    ]);
  }

  private async _findOne<T>(
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

  isValidCurrency(currency: string) {
    if (currency !== 'PHP')
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

  // remove money from player balance (credit on our DB)
  // @TODO: 2024-06-24 - Implement later "ROUND_NOT_FOUND", "ROUND_ENDED"
  async debit(data: FormDebitDTO) {
    this.isValidCurrency(data.currency);

    const remainingBalance = await this.coinService.computeBalance(data.player);
    if (remainingBalance - data.amount <= 0) {
      throw new HttpException(
        { currency: 'PHP', balance: remainingBalance },
        HttpStatus.PAYMENT_REQUIRED,
      );
    }

    const [player, game] = await this._getPlayerAndGame(data.player, data.game);

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

  // rolling back a player deposit from the game
  // which means we undo player credit to debit in our DB
  async rollback(data: FormRollbackDTO) {
    const player = await this._findOne<User>(
      this.userRepo,
      { id: data.player },
      { errorCode: 'PLAYER_NOT_FOUND', errorMessage: 'Player not found' },
    );

    // in game's perspective we are undoing a debit (this means CREDIT in our DB)
    const txCredit = await this._findOne<CoinTransaction>(
      this.coinRepo,
      { id: data.originalTransId },
      { errorCode: 'TRANS_NOT_FOUND', errorMessage: 'Transaction not found' },
    );

    // undo game's debit by making a credit (this means DEBIT in our DB)
    const txDebit = CoinTransaction.builder()
      .player(player)
      .roundId(data.roundId)
      .game(txCredit.game)
      .type(TransactionType.DEBIT)
      .typeCategory(TransactionTypeCategory.ROLL_BACK)
      .amount(txCredit.amount)
      .createdBy(player)
      .build();

    await this.coinRepo.save(txDebit);
  }

  // remove money from game and add it to player balance (debit on our DB)
  // @TODO: 2024-06-24 - Implement later "ROUND_NOT_FOUND", "ROUND_ENDED"
  async credit(data: FormCreditDTO) {
    this.isValidCurrency(data.currency);
    const [player, game] = await this._getPlayerAndGame(data.player, data.game);

    const txCredit = await this.coinRepo.findOne({ where: { roundId: data.roundId } });
    if (!txCredit) {
      throw new NotFoundException(`Credit counterpart not found: roundId=${data.roundId}`);
    }

    const WIN_OR_LOSS =
      data.amount - txCredit.amount >= 0
        ? TransactionTypeCategory.WIN
        : TransactionTypeCategory.LOSS;

    const txDebit = CoinTransaction.builder()
      .id(data.transId)
      .player(player)
      .roundId(data.roundId)
      .game(game)
      .type(TransactionType.DEBIT)
      .typeCategory(WIN_OR_LOSS)
      .amount(data.amount)
      .createdBy(player)
      .build();

    await this.coinRepo.save(txDebit);

    return this.coinService.computeBalance(data.player);
  }

  // remove money from game and add it to player balance (debit on our DB)
  async payout(data: FormPayoutDTO) {
    const [player, game] = await this._getPlayerAndGame(data.player, data.game);

    const txDebit = CoinTransaction.builder()
      .id(data.transId)
      .player(player)
      .roundId(data.roundId)
      .game(game)
      .type(TransactionType.DEBIT)
      .typeCategory(TransactionTypeCategory.PAYOUT)
      .amount(data.amount)
      .createdBy(player)
      .build();

    await this.coinRepo.save(txDebit);

    return await this.coinService.computeBalance(data.player);
  }
}
