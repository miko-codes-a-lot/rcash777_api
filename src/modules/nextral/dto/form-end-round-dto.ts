import { Platform } from 'src/enums/platform.enum';

export interface FormEndRoundDTO {
  player: string;
  clientToken: string;
  roundId: string;
  game: string;
  platform: Platform;
}
