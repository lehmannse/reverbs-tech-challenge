import type { PokemonSummary } from '../../shared/types/pokemon';

const TYPE_COLOR: Record<string, string> = {
  normal: 'bg-zinc-200 text-zinc-800',
  fire: 'bg-red-200 text-red-800',
  water: 'bg-blue-200 text-blue-800',
  grass: 'bg-green-200 text-green-800',
  electric: 'bg-yellow-200 text-yellow-800',
  ice: 'bg-cyan-200 text-cyan-800',
  fighting: 'bg-orange-200 text-orange-900',
  poison: 'bg-fuchsia-200 text-fuchsia-800',
  ground: 'bg-amber-200 text-amber-900',
  flying: 'bg-indigo-200 text-indigo-800',
  psychic: 'bg-pink-200 text-pink-800',
  bug: 'bg-lime-200 text-lime-800',
  rock: 'bg-stone-300 text-stone-900',
  ghost: 'bg-violet-200 text-violet-900',
  dragon: 'bg-sky-300 text-sky-900',
  dark: 'bg-slate-300 text-slate-900',
  steel: 'bg-gray-200 text-gray-800',
  fairy: 'bg-rose-200 text-rose-800',
};

type Props = {
  item: PokemonSummary;
};

export default function PokemonCard({ item }: Props) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 grid gap-2">
      <div className="flex justify-center">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            width={96}
            height={96}
            className="h-24 w-24 object-contain"
          />
        ) : (
          <div className="h-24 w-24 rounded bg-slate-100 text-slate-500 flex items-center justify-center">
            No image
          </div>
        )}
      </div>
      <div className="font-medium">
        #{item.id} {capitalize(item.name)}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {item.types.map((t) => {
          const key = t.toLowerCase();
          const color = TYPE_COLOR[key] ?? 'bg-slate-200 text-slate-800';
          return (
            <span
              key={t}
              className={`px-2 py-0.5 text-xs rounded-full ${color}`}
            >
              {t}
            </span>
          );
        })}
      </div>
      <div className="text-sm text-slate-700">
        {item.heightM} m • {item.weightKg} kg
      </div>
      <div className="text-xs text-slate-700 grid gap-0.5">
        <div className="flex gap-2">
          <div>HP: {item.baseStats.hp}</div>
          <div>Atk: {item.baseStats.attack}</div>
          <div>Def: {item.baseStats.defense}</div>
        </div>
        <div className="flex gap-2">
          <div>SpA: {item.baseStats.specialAttack}</div>
          <div>SpD: {item.baseStats.specialDefense}</div>
          <div>Spe: {item.baseStats.speed}</div>
        </div>
      </div>
      <div className="text-xs text-slate-500">
        Primary Ability: {capitalize(item.primaryAbility)}
      </div>
    </div>
  );
}

function capitalize(s: string) {
  return s.length ? s[0].toUpperCase() + s.slice(1) : s;
}
