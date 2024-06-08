export interface PaginationDTO {
  page: number;
  pageSize: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export type PaginationResponse<T> = {
  list: T[];
  total: number;
};
