import { DataSource, DataSourceOptions } from 'typeorm';

import { SeederOptions } from 'typeorm-extension';
import config from 'src/config/config';

export const dataSourceOptions: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: config.pg.host,
  port: 5432,
  username: config.pg.username,
  password: config.pg.password,
  database: config.pg.database,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/db/migrations/*.js'],
  seeds: ['dist/db/seeds/**/*.js'],
  factories: ['dist/db/factories/**/*.js'],
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
