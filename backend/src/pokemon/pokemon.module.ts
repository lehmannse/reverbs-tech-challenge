import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PokemonService } from './pokemon.service.js';
import { PokemonController } from './pokemon.controller.js';
import { PokeApiService } from '../shared/pokeapi.service.js';

@Module({
  imports: [HttpModule],
  controllers: [PokemonController],
  providers: [PokemonService, PokeApiService],
  exports: [PokemonService]
})
export class PokemonModule {}


