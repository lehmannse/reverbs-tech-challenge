import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BattleResult } from './battle-result.entity.js';
import { BattleAiService, PROMPT_VERSION } from './ai.service.js';
import { PokemonService } from '../pokemon/pokemon.service.js';

export interface SimulateBattleDto {
  pokemon1Id: number;
  pokemon2Id: number;
}

@Injectable()
export class BattleService {
  constructor(
    @InjectRepository(BattleResult)
    private readonly battleRepo: Repository<BattleResult>,
    private readonly ai: BattleAiService,
    private readonly pokemon: PokemonService
  ) {}

  private matchKeyFor(a: number, b: number) {
    const min = Math.min(a, b);
    const max = Math.max(a, b);
    return `${PROMPT_VERSION}:${min}-${max}`;
  }

  async simulate({
    pokemon1Id,
    pokemon2Id,
  }: SimulateBattleDto): Promise<BattleResult> {
    const id1 = Number(pokemon1Id);
    const id2 = Number(pokemon2Id);
    if (
      !Number.isFinite(id1) ||
      !Number.isFinite(id2) ||
      id1 <= 0 ||
      id2 <= 0
    ) {
      throw new Error('pokemon1Id and pokemon2Id must be positive numbers.');
    }

    const matchKey = this.matchKeyFor(id1, id2);
    const cached = await this.battleRepo.findOne({ where: { matchKey } });
    if (cached) return cached;

    const p1 = await this.pokemon.getPokemonBattleProfile(String(id1));
    const p2 = await this.pokemon.getPokemonBattleProfile(String(id2));

    // No fallback: Gemini is the source of narration (or the request fails).
    const outcome = await this.ai.narrateBattle(p1, p2);

    const result = this.battleRepo.create({
      matchKey,
      pokemon1Id: id1,
      pokemon1Name: p1.name,
      pokemon2Id: id2,
      pokemon2Name: p2.name,
      winnerId: outcome.winnerId,
      winnerName: outcome.winnerName,
      narration: outcome.narration,
      provider: outcome.provider,
      model: outcome.model,
      promptVersion: outcome.promptVersion,
    });

    return await this.battleRepo.save(result);
  }

  findAll(): Promise<BattleResult[]> {
    return this.battleRepo.find({ order: { timestamp: 'DESC' } });
  }
}
