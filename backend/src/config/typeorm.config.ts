import { DataSourceOptions } from 'typeorm';
import { BattleResult } from '../battle/battle-result.entity.js';
import * as fs from 'node:fs';
import * as path from 'node:path';

export function typeOrmConfig(): DataSourceOptions {
  const database = process.env.DB_PATH ?? 'data/pokedex.sqlite';
  const dir = path.dirname(database);
  if (dir && dir !== '.' && !fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  return {
    type: 'sqlite',
    database: database,
    entities: [BattleResult],
    synchronize: true,
  };
}



