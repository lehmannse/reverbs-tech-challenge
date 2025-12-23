import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

const BASE_URL = 'https://pokeapi.co/api/v2';

type PokeApiNamedList = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Array<{ name: string; url: string }>;
};

@Injectable()
export class PokeApiService {
  constructor(private readonly http: HttpService) {}

  private detailCache = new Map<string, { data: any; ts: number }>();
  private speciesCache = new Map<string, { data: any; ts: number }>();
  private readonly ttlMs = 15 * 60 * 1000; // 5 minutes

  async getPokemon(idOrName: string | number): Promise<any> {
    const url = `${BASE_URL}/pokemon/${idOrName}`;
    const res = await firstValueFrom(this.http.get(url));
    return res.data;
  }

  async listPokemon(offset = 0, limit = 20): Promise<PokeApiNamedList> {
    const url = `${BASE_URL}/pokemon?offset=${offset}&limit=${limit}`;
    const res = await firstValueFrom(this.http.get(url));
    return res.data;
  }

  async getPokemonDetails(idOrName: string | number): Promise<any> {
    const key = String(idOrName).toLowerCase();
    const now = Date.now();
    const cached = this.detailCache.get(key);
    if (cached && now - cached.ts < this.ttlMs) {
      return cached.data;
    }
    const data = await this.getPokemon(idOrName);
    this.detailCache.set(key, { data, ts: now });
    return data;
  }

  async getPokemonSpecies(idOrName: string | number): Promise<any> {
    const key = String(idOrName).toLowerCase();
    const now = Date.now();
    const cached = this.speciesCache.get(key);
    if (cached && now - cached.ts < this.ttlMs) {
      return cached.data;
    }
    const url = `${BASE_URL}/pokemon-species/${idOrName}`;
    const res = await firstValueFrom(this.http.get(url));
    const data = res.data;
    this.speciesCache.set(key, { data, ts: now });
    return data;
  }
}
