import { CoinRequestStatus, CoinRequestType } from 'src/enums/coin-request.enum';
import { CommissionType } from 'src/enums/commission.enum';

export class PaginationDTO {
  page: number = 1;
  pageSize: number = 10;
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export class UserPaginateDTO extends PaginationDTO {
  role?: string;
}

export class CommissionPaginateDTO extends PaginationDTO {
  types?: CommissionType[];
  startDate: Date;
  endDate: Date;
}

export class CommissionUnitPaginateDTO extends CommissionPaginateDTO {
  roles?: Array<'isOwner' | 'isCityManager' | 'isMasterAgent' | 'isAgent'>;
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
