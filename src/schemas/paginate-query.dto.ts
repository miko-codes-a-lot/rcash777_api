export class PaginationDTO {
  page: number;
  pageSize: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export class GamePaginationDTO extends PaginationDTO {
  category?: string;
  providerCode?: string;
}

export type PaginationResponse<T> = {
  list: T[];
  total: number;
};
