import { IsEnum, IsNotEmpty, IsNumber, IsNumberString, Max, Min } from 'class-validator';
import { UserRole } from 'src/enums/user-role.enum';

export class UserTopCommissionDTO {
  @IsNumber()
  @Max(20)
  @Min(5)
  top: number = 10;

  @IsNotEmpty()
  @IsEnum(UserRole)
  role: 'isOwner' | 'isCityManager' | 'isMasterAgent' | 'isAgent';
}
