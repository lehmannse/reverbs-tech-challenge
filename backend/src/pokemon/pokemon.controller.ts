import { Controller, Get, Param, Query } from '@nestjs/common';
import { PokemonService } from './pokemon.service.js';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly service: PokemonService) {}

  @Get()
  list(@Query('offset') offset?: string, @Query('limit') limit?: string) {
    const o = Number.isFinite(Number(offset)) ? Number(offset) : 0;
    const l = Number.isFinite(Number(limit)) ? Number(limit) : 20;
    return this.service.listPokemon(o, l);
    }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.service.getPokemon(id);
  }
}


