import { ERoles } from 'src/enums/roles.enum';
import { valueOf } from 'src/types/valueOf.type';

export interface IUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  address: string;
  role: valueOf<ERoles>;
  created_at: string;
  updated_at: string;
}
