import { Injectable } from '@nestjs/common';
import { PokeApiService } from '../shared/pokeapi.service.js';
import { mapPokemonToDetailLite, mapPokemonToSummary } from './pokemon.mapper.js';
import type { PokemonListEnrichedResponse, PokemonSummary } from '../../../shared/types/pokemon';
import type { PokemonDetailLite } from '../../../shared/types/pokemon';

export type PokemonBattleProfile = PokemonDetailLite & {
  moves: string[];
};

@Injectable()
export class PokemonService {
  constructor(private readonly pokeApi: PokeApiService) {}

  async getPokemonDetailLite(idOrName: string): Promise<PokemonDetailLite> {
    const details = await this.pokeApi.getPokemonDetails(idOrName);
    return mapPokemonToDetailLite(details);
  }

  async getPokemonBattleProfile(idOrName: string): Promise<PokemonBattleProfile> {
    const details = await this.pokeApi.getPokemonDetails(idOrName);
    const lite = mapPokemonToDetailLite(details);
    const moves: string[] = Array.isArray(details?.moves)
      ? details.moves
          .map((m: any) => m?.move?.name)
          .filter(Boolean)
          .slice(0, 40)
      : [];

    return { ...lite, moves };
  }

  listPokemon(offset = 0, limit = 20) {
    return this.pokeApi.listPokemon(offset, limit);
  }

  async listEnriched(offset = 0, limit = 20): Promise<PokemonListEnrichedResponse> {
    const base = await this.pokeApi.listPokemon(offset, limit);
    const results = base.results ?? [];

    const summaries: PokemonSummary[] = await Promise.all(
      results.map(async (r: any) => {
        const idFromUrl = (url: string): string => {
          const parts = url.split('/').filter(Boolean);
          return parts[parts.length - 1] ?? '';
        };
        const idOrName = r?.name ?? idFromUrl(r?.url ?? '');
        const details = await this.pokeApi.getPokemonDetails(idOrName);
        return mapPokemonToSummary(details);
      })
    );

    const parseOffset = (url: string | null | undefined): number | null => {
      if (!url) return null;
      try {
        const u = new URL(url);
        const off = u.searchParams.get('offset');
        return off ? parseInt(off, 10) : null;
      } catch {
        return null;
      }
    };

    return {
      count: base.count ?? summaries.length,
      nextOffset: parseOffset(base.next),
      previousOffset: parseOffset(base.previous),
      results: summaries
    };
  }
}


