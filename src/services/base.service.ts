import { Like, Repository } from 'typeorm';
import { Pagination, PaginationResponse } from 'src/schemas/pagination.schema';

type SearchType = {
  fields?: string[]; // Pagination search fields
  where?: {
    // TypeOrm WHERE objects
    [key: string]: string | number;
  };
};

export class BaseService<T> {
  protected repository: Repository<T>;

  get(): Repository<T> {
    return this.repository;
  }

  set(value: T) {
    return this.repository.save(value);
  }

  async findById(id: string) {
    return await this.repository.findOne({ where: { id } as any });
  }

  async findByUserId(id: string) {
    return await this.repository.findOne({ where: { user_id: id } as any });
  }

  async findAll() {
    return await this.repository.find();
  }

  async findAllPaginate(
    pagination: Pagination,
    searchObj?: SearchType,
  ): Promise<PaginationResponse<T>> {
    const { page, per_page, search, order_by, sort = 'desc' } = pagination;
    const { fields = [], where: _where = {} } = searchObj || {};

    const [list, total] = await this.repository.findAndCount({
      skip: (page - 1) * per_page,
      take: per_page,
      where: [_where, fields.map((field) => ({ [field]: Like('%' + search + '%') }))],
      ...(order_by ? { order: { [order_by]: sort } } : {}),
    } as any);

    return {
      list,
      total,
    };
  }

  async delete(id: string) {
    const data = await this.findByUserId(id);

    return this.repository.remove(data);
  }
}
