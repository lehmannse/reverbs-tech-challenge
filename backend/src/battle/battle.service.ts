import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BattleResult } from './battle-result.entity.js';
import { BattleAiService } from './ai.service.js';

export interface SimulateBattleDto {
  pokemon1Name: string;
  pokemon2Name: string;
}

@Injectable()
export class BattleService {
  constructor(
    @InjectRepository(BattleResult)
    private readonly battleRepo: Repository<BattleResult>,
    private readonly ai: BattleAiService
  ) {}

  async simulate({ pokemon1Name, pokemon2Name }: SimulateBattleDto): Promise<BattleResult> {
    let winner = await this.ai.suggestWinner(pokemon1Name, pokemon2Name);
    if (!winner) {
      // Deterministic placeholder: lexicographic comparison
      winner = pokemon1Name.localeCompare(pokemon2Name) <= 0 ? pokemon1Name : pokemon2Name;
    }

    const result = this.battleRepo.create({
      pokemon1Name,
      pokemon2Name,
      winnerName: winner
    });
    return await this.battleRepo.save(result);
  }

  findAll(): Promise<BattleResult[]> {
    return this.battleRepo.find({ order: { timestamp: 'DESC' } });
  }
}


