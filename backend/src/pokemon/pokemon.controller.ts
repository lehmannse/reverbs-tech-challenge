import { Controller, Get, Param, Query } from '@nestjs/common';
import { PokemonService } from './pokemon.service.js';
import type { PokemonListEnrichedResponse } from '../../../shared/types/pokemon';
import type { PokemonDetailLite } from '../../../shared/types/pokemon';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly service: PokemonService) {}

  @Get()
  list(
    @Query('offset') offset?: string,
    @Query('limit') limit?: string
  ): Promise<PokemonListEnrichedResponse> {
    const o = Number.isFinite(Number(offset)) ? Number(offset) : 0;
    const l = Number.isFinite(Number(limit)) ? Number(limit) : 20;
    return this.service.listEnriched(o, l);
  }

  @Get(':id')
  get(@Param('id') id: string): Promise<PokemonDetailLite> {
    return this.service.getPokemonDetailLite(id);
  }
}
