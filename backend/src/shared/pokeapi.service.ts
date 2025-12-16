import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

const BASE_URL = 'https://pokeapi.co/api/v2';

@Injectable()
export class PokeApiService {
  constructor(private readonly http: HttpService) {}

  async getPokemon(idOrName: string | number): Promise<any> {
    const url = `${BASE_URL}/pokemon/${idOrName}`;
    const res = await firstValueFrom(this.http.get(url));
    return res.data;
  }

  async listPokemon(offset = 0, limit = 20): Promise<any> {
    const url = `${BASE_URL}/pokemon?offset=${offset}&limit=${limit}`;
    const res = await firstValueFrom(this.http.get(url));
    return res.data;
  }
}


