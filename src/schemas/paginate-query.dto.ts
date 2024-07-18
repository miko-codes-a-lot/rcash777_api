import { CoinRequestStatus, CoinRequestType } from 'src/enums/coin-request.enum';

export class PaginationDTO {
  page: number = 1;
  pageSize: number = 10;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export class UserPaginateDTO extends PaginationDTO {
  role?: string;
}

export class CoinRequestPaginateDTO extends PaginationDTO {
  status: CoinRequestStatus[] = [CoinRequestStatus.PENDING];
  type: CoinRequestType;
}

export class GamePaginationDTO extends PaginationDTO {
  category?: string;
  providerCode?: string;
}

export type PaginationResponse<T> = {
  list: T[];
  total: number;
};
