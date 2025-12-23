import type { PokemonSummary } from '../../shared/types/pokemon';
import Link from 'next/link';
import type { ComponentType } from 'react';
import {
  Bug,
  Circle,
  Cog,
  Dna,
  Droplet,
  Eye,
  Flame,
  Gem,
  Ghost,
  Leaf,
  Moon,
  Mountain,
  Skull,
  Snowflake,
  Sparkles,
  Swords,
  Wind,
  Zap,
} from 'lucide-react';

export const TYPE_THEME: Record<
  string,
  { chip: string; panel: string; icon: string }
> = {
  normal: {
    chip: 'bg-zinc-200 text-zinc-900',
    panel: 'bg-zinc-200/70',
    icon: 'text-zinc-800',
  },
  fire: {
    chip: 'bg-orange-200 text-orange-900',
    panel: 'bg-orange-200/70',
    icon: 'text-orange-800',
  },
  water: {
    chip: 'bg-sky-200 text-sky-900',
    panel: 'bg-sky-200/70',
    icon: 'text-sky-800',
  },
  grass: {
    chip: 'bg-emerald-200 text-emerald-900',
    panel: 'bg-emerald-200/70',
    icon: 'text-emerald-800',
  },
  electric: {
    chip: 'bg-yellow-200 text-yellow-900',
    panel: 'bg-yellow-200/70',
    icon: 'text-yellow-800',
  },
  ice: {
    chip: 'bg-cyan-200 text-cyan-900',
    panel: 'bg-cyan-200/70',
    icon: 'text-cyan-800',
  },
  fighting: {
    chip: 'bg-orange-200 text-orange-900',
    panel: 'bg-orange-200/70',
    icon: 'text-orange-800',
  },
  poison: {
    chip: 'bg-fuchsia-200 text-fuchsia-900',
    panel: 'bg-fuchsia-200/70',
    icon: 'text-fuchsia-800',
  },
  ground: {
    chip: 'bg-amber-200 text-amber-900',
    panel: 'bg-amber-200/70',
    icon: 'text-amber-800',
  },
  flying: {
    chip: 'bg-indigo-200 text-indigo-900',
    panel: 'bg-indigo-200/70',
    icon: 'text-indigo-800',
  },
  psychic: {
    chip: 'bg-pink-200 text-pink-900',
    panel: 'bg-pink-200/70',
    icon: 'text-pink-800',
  },
  bug: {
    chip: 'bg-lime-200 text-lime-900',
    panel: 'bg-lime-200/70',
    icon: 'text-lime-800',
  },
  rock: {
    chip: 'bg-stone-300 text-stone-900',
    panel: 'bg-stone-300/70',
    icon: 'text-stone-800',
  },
  ghost: {
    chip: 'bg-violet-200 text-violet-900',
    panel: 'bg-violet-200/70',
    icon: 'text-violet-800',
  },
  dragon: {
    chip: 'bg-sky-300 text-sky-950',
    panel: 'bg-sky-300/70',
    icon: 'text-sky-900',
  },
  dark: {
    chip: 'bg-slate-300 text-slate-950',
    panel: 'bg-slate-300/70',
    icon: 'text-slate-900',
  },
  steel: {
    chip: 'bg-gray-200 text-gray-900',
    panel: 'bg-gray-200/70',
    icon: 'text-gray-800',
  },
  fairy: {
    chip: 'bg-rose-200 text-rose-900',
    panel: 'bg-rose-200/70',
    icon: 'text-rose-800',
  },
};

export const TYPE_ICON: Record<
  string,
  ComponentType<{ className?: string }>
> = {
  normal: Circle,
  fire: Flame,
  water: Droplet,
  grass: Leaf,
  electric: Zap,
  ice: Snowflake,
  fighting: Swords,
  poison: Skull,
  ground: Mountain,
  flying: Wind,
  psychic: Eye,
  bug: Bug,
  rock: Gem,
  ghost: Ghost,
  dragon: Dna,
  dark: Moon,
  steel: Cog,
  fairy: Sparkles,
};

type Props = {
  item: PokemonSummary;
};

export default function PokemonCard({ item }: Props) {
  const primaryType = (item.types[0] ?? '').toLowerCase();
  const theme = TYPE_THEME[primaryType] ?? {
    chip: 'bg-slate-200 text-slate-900',
    panel: 'bg-slate-200/70',
    icon: 'text-slate-800',
  };
  const PrimaryIcon = TYPE_ICON[primaryType] ?? Circle;

  return (
    <Link
      href={`/pokemon/${item.id}`}
      className="group block overflow-hidden rounded-2xl border border-slate-200/80 bg-white ring-1 ring-black/5 shadow-md shadow-slate-900/5 transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-xl hover:shadow-slate-900/10 focus:outline-none focus:ring-2 focus:ring-slate-900/20"
      aria-label={`Open details for ${item.name}`}
    >
      <div className="flex items-stretch">
        <div className="flex-1 px-4 py-3">
          <div className="text-[11px] text-slate-600 tracking-wide">
            N°{String(item.id).padStart(3, '0')}
          </div>
          <div className="mt-1 text-lg leading-tight">
            {capitalize(item.name)}
          </div>

          <div className="mt-2 flex flex-wrap gap-2">
            {item.types.slice(0, 2).map((t) => {
              const key = t.toLowerCase();
              const Icon = TYPE_ICON[key] ?? Circle;
              const iconClass = TYPE_THEME[key]?.icon ?? 'text-slate-800';
              const chip =
                (TYPE_THEME[key]?.chip ?? 'bg-slate-200 text-slate-900') + ' ';
              return (
                <span
                  key={t}
                  className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs ${chip}`}
                >
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/60">
                    <Icon className={`h-3.5 w-3.5 ${iconClass}`} />
                  </span>
                  {capitalize(t)}
                </span>
              );
            })}
          </div>
        </div>

        <div
          className={`relative flex w-32 shrink-0 items-center justify-center ${theme.panel}`}
        >
          <div
            aria-hidden
            className="absolute inset-0 flex items-center justify-center opacity-20"
          >
            <PrimaryIcon className={`h-20 w-20 ${theme.icon}`} />
          </div>
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              width={120}
              height={120}
              className="relative h-20 w-20 object-contain drop-shadow-md transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="relative h-20 w-20 rounded-xl bg-white/60 text-slate-600 flex items-center justify-center text-xs">
              No image
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

export function capitalize(s: string) {
  return s.length ? s[0].toUpperCase() + s.slice(1) : s;
}
