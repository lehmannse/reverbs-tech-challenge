import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BattleResult } from './battle-result.entity.js';
import { BattleService } from './battle.service.js';
import { BattleController } from './battle.controller.js';
import { BattleAiService } from './ai.service.js';
import { PokemonModule } from '../pokemon/pokemon.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([BattleResult]), PokemonModule],
  controllers: [BattleController],
  providers: [BattleService, BattleAiService],
})
export class BattleModule {}
