import { DataSource, DataSourceOptions } from 'typeorm';

import config from 'src/config/config';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: config.pg.host,
  port: 5432,
  username: config.pg.username,
  password: config.pg.password,
  database: config.pg.database,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/db/migrations/*.js'],
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
