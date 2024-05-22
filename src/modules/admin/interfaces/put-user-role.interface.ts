import { ERoles } from 'src/enums/roles.enum';
import { valueOf } from 'src/types/valueOf.type';

export interface IPutUserRoleRequest {
  new_role: valueOf<typeof ERoles>;
}
