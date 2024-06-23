import { Platform } from 'src/enums/platform.enum';

export interface FormCreditDTO {
  player: string;
  clientToken: string;
  roundId: string;
  game: string;
  platform: Platform;
  transId: string;
  currency: string;
  amount: string;
  jackpotAmount?: number;
  roundEnded: boolean;
}
