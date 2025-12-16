import { DataSourceOptions } from 'typeorm';
import { BattleResult } from '../battle/battle-result.entity.js';

export function typeOrmConfig(): DataSourceOptions {
  const host = process.env.DB_HOST ?? 'localhost';
  const port = parseInt(process.env.DB_PORT ?? '5432', 10);
  const username = process.env.DB_USER ?? 'pokedex';
  const password = process.env.DB_PASS ?? 'pokedex';
  const database = process.env.DB_NAME ?? 'pokedex';

  return {
    type: 'postgres',
    host,
    port,
    username,
    password,
    database,
    entities: [BattleResult],
    synchronize: true,
    ssl: false
  };
}


