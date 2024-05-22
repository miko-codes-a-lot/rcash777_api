import * as Joi from 'joi';

export const PaginationSchema = Joi.object({
  page: Joi.number().required(),
  per_page: Joi.number().required(),
  search: Joi.string(),
  order_by: Joi.string(),
  sort: Joi.string().valid('asc', 'desc'),
});

export interface Pagination {
  page: number;
  per_page: number;
  search?: string;
  order_by?: string;
  sort?: 'asc' | 'desc';
}

export type PaginationResponse<T> = {
  list: T[];
  total: number;
};
