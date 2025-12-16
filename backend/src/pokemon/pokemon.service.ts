import { Injectable } from '@nestjs/common';
import { PokeApiService } from '../shared/pokeapi.service.js';

@Injectable()
export class PokemonService {
  constructor(private readonly pokeApi: PokeApiService) {}

  getPokemon(idOrName: string) {
    return this.pokeApi.getPokemon(idOrName);
  }

  listPokemon(offset = 0, limit = 20) {
    return this.pokeApi.listPokemon(offset, limit);
  }
}


