export interface PokemonBaseStats {
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
}

export interface PokemonSummary {
  id: number; // Pokédex number
  name: string;
  image: string | null; // sprites.front_default (may be null)
  types: string[]; // primary types (usually up to 2)
  heightM: number; // meters (PokeAPI gives decimeters)
  weightKg: number; // kilograms (PokeAPI gives hectograms)
  baseStats: PokemonBaseStats;
  primaryAbility: string;
}

export interface PokemonListEnrichedResponse {
  count: number;
  nextOffset: number | null;
  previousOffset: number | null;
  results: PokemonSummary[];
}

export type BaseStats = {
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
};

export interface PokemonDetail {
  id: number;
  name: string;
  types: string[];
  heightM: number;
  weightKg: number;
  baseStats: PokemonBaseStats;
  abilities: string[];
  primaryAbility: string;
  /** Official artwork (preferred for hero images). */
  imageOfficial: string | null;
  /** Small sprite fallback. */
  imageSprite: string | null;
  /** Species flavor text (English if available). */
  description: string | null;
  /** Species genus (English if available), e.g. \"Seed Pokémon\". */
  genus: string | null;
}

/**
 * Detail payload derived ONLY from PokeAPI `/pokemon/{id}`.
 * This keeps the frontend decoupled from PokeAPI's full schema.
 */
export interface PokemonDetailLite {
  id: number;
  name: string;
  types: string[];
  heightM: number;
  weightKg: number;
  baseStats: PokemonBaseStats;
  abilities: string[];
  primaryAbility: string;
  imageOfficial: string | null;
  imageSprite: string | null;
}
