import type {
  PokemonSummary,
  PokemonBaseStats,
  PokemonDetail,
  PokemonDetailLite
} from '../../../shared/types/pokemon';

function toMeters(heightDecimeters: number): number {
  return Math.round((heightDecimeters / 10) * 100) / 100;
}

function toKilograms(weightHectograms: number): number {
  return Math.round((weightHectograms / 10) * 100) / 100;
}

function mapBaseStats(stats: any[]): PokemonBaseStats {
  const byName = new Map<string, number>();
  for (const s of stats ?? []) {
    const name: string = s?.stat?.name ?? '';
    const val: number = s?.base_stat ?? 0;
    byName.set(name, val);
  }
  return {
    hp: byName.get('hp') ?? 0,
    attack: byName.get('attack') ?? 0,
    defense: byName.get('defense') ?? 0,
    specialAttack: byName.get('special-attack') ?? 0,
    specialDefense: byName.get('special-defense') ?? 0,
    speed: byName.get('speed') ?? 0
  };
}

export function mapPokemonToSummary(data: any): PokemonSummary {
  const abilities = Array.isArray(data?.abilities) ? data.abilities : [];
  const primaryAbility =
    abilities.find((a: any) => a && a.is_hidden === false)?.ability?.name ??
    abilities[0]?.ability?.name ??
    '';

  const types =
    Array.isArray(data?.types) ? data.types.map((t: any) => t?.type?.name).filter(Boolean) : [];

  const spriteDefault: string | null = data?.sprites?.front_default ?? null;
  const artwork: string | null = data?.sprites?.other?.['official-artwork']?.front_default ?? null;

  return {
    id: data?.id ?? 0,
    name: data?.name ?? '',
    image: spriteDefault ?? artwork ?? null,
    types,
    heightM: toMeters(data?.height ?? 0),
    weightKg: toKilograms(data?.weight ?? 0),
    baseStats: mapBaseStats(data?.stats ?? []),
    primaryAbility
  };
}

export function mapPokemonToDetailLite(pokemon: any): PokemonDetailLite {
  const abilitiesArr = Array.isArray(pokemon?.abilities) ? pokemon.abilities : [];
  const abilities = abilitiesArr
    .map((a: any) => a?.ability?.name)
    .filter(Boolean)
    .slice(0, 12);

  const primaryAbility =
    abilitiesArr.find((a: any) => a && a.is_hidden === false)?.ability?.name ??
    abilitiesArr[0]?.ability?.name ??
    '';

  const types = Array.isArray(pokemon?.types)
    ? pokemon.types.map((t: any) => t?.type?.name).filter(Boolean)
    : [];

  const imageSprite: string | null = pokemon?.sprites?.front_default ?? null;
  const imageOfficial: string | null =
    pokemon?.sprites?.other?.['official-artwork']?.front_default ?? null;

  return {
    id: pokemon?.id ?? 0,
    name: pokemon?.name ?? '',
    types,
    heightM: toMeters(pokemon?.height ?? 0),
    weightKg: toKilograms(pokemon?.weight ?? 0),
    baseStats: mapBaseStats(pokemon?.stats ?? []),
    abilities,
    primaryAbility,
    imageOfficial: imageOfficial ?? null,
    imageSprite: imageSprite ?? null
  };
}

function normalizeFlavorText(s: string): string {
  return s.replace(/\s+/g, ' ').replace(/\f/g, ' ').trim();
}

function pickLocalized<T>(
  arr: any[],
  getLang: (x: any) => string | undefined,
  lang = 'en'
): any | null {
  if (!Array.isArray(arr) || arr.length === 0) return null;
  return arr.find((x) => getLang(x) === lang) ?? arr[0] ?? null;
}

export function mapPokemonToDetail(pokemon: any, species: any): PokemonDetail {
  const abilitiesArr = Array.isArray(pokemon?.abilities) ? pokemon.abilities : [];
  const abilities = abilitiesArr
    .map((a: any) => a?.ability?.name)
    .filter(Boolean)
    .slice(0, 6);

  const primaryAbility =
    abilitiesArr.find((a: any) => a && a.is_hidden === false)?.ability?.name ??
    abilitiesArr[0]?.ability?.name ??
    '';

  const types = Array.isArray(pokemon?.types)
    ? pokemon.types.map((t: any) => t?.type?.name).filter(Boolean)
    : [];

  const imageSprite: string | null = pokemon?.sprites?.front_default ?? null;
  const imageOfficial: string | null =
    pokemon?.sprites?.other?.['official-artwork']?.front_default ?? null;

  const ft = pickLocalized(
    species?.flavor_text_entries ?? [],
    (x) => x?.language?.name,
    'en'
  );
  const descriptionRaw: string | null = ft?.flavor_text ?? null;

  const genusEntry = pickLocalized(species?.genera ?? [], (x) => x?.language?.name, 'en');
  const genusRaw: string | null = genusEntry?.genus ?? null;

  return {
    id: pokemon?.id ?? 0,
    name: pokemon?.name ?? '',
    types,
    heightM: toMeters(pokemon?.height ?? 0),
    weightKg: toKilograms(pokemon?.weight ?? 0),
    baseStats: mapBaseStats(pokemon?.stats ?? []),
    abilities,
    primaryAbility,
    imageOfficial: imageOfficial ?? null,
    imageSprite: imageSprite ?? null,
    description: descriptionRaw ? normalizeFlavorText(descriptionRaw) : null,
    genus: genusRaw ? normalizeFlavorText(genusRaw) : null
  };
}



