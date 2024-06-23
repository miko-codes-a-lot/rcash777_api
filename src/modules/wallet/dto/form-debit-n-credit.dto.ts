import { Platform } from 'src/enums/platform.enum';

export interface FormDebitAndCreditDTO {
  player: string;
  clientToken: string;
  roundId: string;
  game: string;
  platform: Platform;
  transId: string;
  currency: string;
  bet: number;
  win: number;
  jpContrib: string;
  jackpotAmount: string;
  roundEnded: false;
}
