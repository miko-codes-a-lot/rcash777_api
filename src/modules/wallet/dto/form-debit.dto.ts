import { DebitReason } from 'src/enums/debit-reason.enum';
import { Platform } from 'src/enums/platform.enum';

export interface FormDebit {
  player: string;
  clientToken: string;
  roundId: string;
  game: string;
  platform: Platform;
  transId: string;
  currency: string;
  amount: number;
  jpContrib?: number;
  reason: DebitReason;
}
