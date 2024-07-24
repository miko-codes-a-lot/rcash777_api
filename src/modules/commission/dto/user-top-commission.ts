import { IsEnum, IsNotEmpty, IsNumberString } from 'class-validator';
import { UserRole } from 'src/enums/user-role.enum';

export class UserTopCommissionDTO {
  @IsNumberString()
  top: number = 10;

  @IsNotEmpty()
  @IsEnum(UserRole)
  role: 'isOwner' | 'isCityManager' | 'isMasterAgent' | 'isAgent';
}
