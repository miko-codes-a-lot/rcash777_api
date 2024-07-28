export interface FormRollbackDTO {
  player: string;
  clientToken: string;
  roundId: string;
  originalTransId: string;
  roundEnded: boolean;
}
