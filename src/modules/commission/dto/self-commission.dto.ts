import { IsDate } from 'class-validator';

export class SelfCommissionDTO {
  @IsDate()
  startDate: Date;

  @IsDate()
  endDate: Date;
}
