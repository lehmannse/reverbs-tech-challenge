import type { PokemonDetailLite } from '../../../../shared/types/pokemon';
import WatermarkedPage from '../../../components/WatermarkedPage';
import BackButton from '../../../components/BackButton';
import { getPokemonDetail } from '../../../lib/api';
import {
  TYPE_ICON,
  TYPE_THEME,
  capitalize,
} from '../../../components/PokemonCard';

interface PokemonPageProps {
  params: { id: string };
}

export default async function PokemonDetailPage({ params }: PokemonPageProps) {
  const { id } = await params;

  let data: PokemonDetailLite | null = null;
  let error: string | null = null;
  try {
    data = await getPokemonDetail(id);
  } catch (e: any) {
    error = e?.message ?? 'Failed to load Pokémon.';
  }

  return (
    <WatermarkedPage containerClassName="max-w-6xl">
      <header className="page-header">
        <BackButton />
        <div className="text-center">
          <h2 className="page-title font-pokemon py-2 uppercase">
            {data ? capitalize(data.name) : 'Pokémon'}
          </h2>
          <div className="page-subtitle">
            {data ? `N°${String(data.id).padStart(3, '0')}` : `ID: ${id}`}
          </div>
        </div>
        <div className="w-[68px]" />
      </header>

      {error || !data ? (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 text-slate-700">
          <div className="text-sm font-medium text-slate-900">
            Couldn’t load Pokémon
          </div>
          <div className="mt-1 text-sm">{error ?? 'Unknown error.'}</div>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-[420px,1fr]">
          {/* Left: hero */}
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white ring-1 ring-black/5 shadow-md shadow-slate-900/5">
            <div
              className={`relative h-56 bg-linear-to-br ${getHeroGradientClass(
                data.types
              )} rounded-b-3xl`}
            >
              <div
                aria-hidden
                className="absolute inset-0 bg-polka-dots opacity-[0.14] mask-[radial-gradient(circle_at_center,black_0%,black_40%,transparent_72%)] [-webkit-mask-image:radial-gradient(circle_at_center,black_0%,black_40%,transparent_72%)] mask-no-repeat -webkit-mask-repeat:no-repeat mask-size:cover [-webkit-mask-size:cover]"
              />
              <div
                aria-hidden
                className="absolute right-28 top-22 h-20 w-20 rounded-full bg-white/25 blur-[2px]"
              />
              <div
                aria-hidden
                className="absolute -right-10 -top-10 h-52 w-52 rounded-full bg-white/35 blur-sm"
              />
              <div className="absolute left-5 top-4 flex flex-wrap gap-2">
                {data.types.slice(0, 2).map((t) => (
                  <TypeChip key={t} type={t} />
                ))}
              </div>

              <div className="absolute inset-0 flex items-end justify-center pb-4">
                {data.imageOfficial || data.imageSprite ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={data.imageOfficial ?? data.imageSprite ?? ''}
                    alt={data.name}
                    width={360}
                    height={360}
                    className="h-48 w-48 select-none object-contain drop-shadow-lg"
                  />
                ) : (
                  <div className="mb-4 flex h-40 w-40 items-center justify-center rounded-3xl bg-white/60 text-sm text-slate-600">
                    No image
                  </div>
                )}
              </div>
            </div>

            <div className="p-5">
              <div className="text-xs tracking-wide text-slate-500">
                Primary ability
              </div>
              <div className="mt-1 text-lg font-medium text-slate-900">
                {capitalize(data.primaryAbility)}
              </div>

              {data.abilities?.length ? (
                <div className="mt-4">
                  <div className="text-xs tracking-wide text-slate-500">
                    Abilities
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {data.abilities.slice(0, 6).map((a) => (
                      <span
                        key={a}
                        className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-800"
                      >
                        {capitalize(a)}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </section>

          {/* Right: info */}
          <section className="grid gap-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <InfoCard
                label="Weight"
                value={`${formatNumber(data.weightKg)} kg`}
              />
              <InfoCard
                label="Height"
                value={`${formatNumber(data.heightM)} m`}
              />
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 ring-1 ring-black/5 shadow-md shadow-slate-900/5">
              <div className="text-sm font-semibold text-slate-900">
                Base stats
              </div>
              <div className="mt-4 grid gap-3">
                <StatRow label="HP" value={data.baseStats.hp} max={255} />
                <StatRow
                  label="Attack"
                  value={data.baseStats.attack}
                  max={255}
                />
                <StatRow
                  label="Defense"
                  value={data.baseStats.defense}
                  max={255}
                />
                <StatRow
                  label="Sp. Atk"
                  value={data.baseStats.specialAttack}
                  max={255}
                />
                <StatRow
                  label="Sp. Def"
                  value={data.baseStats.specialDefense}
                  max={255}
                />
                <StatRow label="Speed" value={data.baseStats.speed} max={255} />
              </div>
            </div>
          </section>
        </div>
      )}
    </WatermarkedPage>
  );
}

function TypeChip({ type }: { type: string }) {
  const key = type.toLowerCase();
  const Icon = TYPE_ICON[key] ?? TYPE_ICON.normal;
  const iconClass = TYPE_THEME[key]?.icon ?? 'text-slate-800';
  const chip = TYPE_THEME[key]?.chip ?? 'bg-slate-200 text-slate-900';
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs ${chip}`}
    >
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/60">
        <Icon className={`h-4 w-4 ${iconClass}`} />
      </span>
      {capitalize(type)}
    </span>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 ring-1 ring-black/5 shadow-md shadow-slate-900/5">
      <div className="text-xs tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 text-xl font-semibold text-slate-900">{value}</div>
    </div>
  );
}

function StatRow({
  label,
  value,
  max,
}: {
  label: string;
  value: number;
  max: number;
}) {
  const pct = Math.max(0, Math.min(100, Math.round((value / max) * 100)));
  return (
    <div className="grid grid-cols-[72px,1fr,44px] items-center gap-3">
      <div className="text-xs font-medium text-slate-600">{label}</div>
      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-linear-to-r from-sky-500 to-emerald-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="text-right text-xs font-semibold tabular-nums text-slate-800">
        {value}
      </div>
    </div>
  );
}

function formatNumber(n: number) {
  return Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(n);
}

function getHeroGradientClass(types: string[]) {
  const t1 = (types?.[0] ?? '').toLowerCase();
  const t2 = (types?.[1] ?? '').toLowerCase();

  const g1 = TYPE_GRADIENT[t1] ?? TYPE_GRADIENT.normal;
  const g2 = (t2 && TYPE_GRADIENT[t2]) || null;

  // Two types: blend primary -> secondary -> secondary (only type colors)
  if (g2) return `${g1.from} ${g2.via} ${g2.to}`;

  // One type: use same hue with different tones (only type colors)
  return `${g1.from} ${g1.via} ${g1.to}`;
}

const TYPE_GRADIENT: Record<
  string,
  { from: string; via: string; to?: string }
> = {
  normal: { from: 'from-zinc-300', via: 'via-zinc-200', to: 'to-zinc-100' },
  fire: { from: 'from-orange-500', via: 'via-amber-300', to: 'to-yellow-200' },
  water: { from: 'from-sky-500', via: 'via-cyan-300', to: 'to-blue-200' },
  grass: { from: 'from-emerald-500', via: 'via-lime-300', to: 'to-green-200' },
  electric: {
    from: 'from-yellow-400',
    via: 'via-amber-300',
    to: 'to-yellow-200',
  },
  ice: { from: 'from-cyan-400', via: 'via-sky-300', to: 'to-cyan-200' },
  fighting: { from: 'from-orange-600', via: 'via-rose-300', to: 'to-red-200' },
  poison: {
    from: 'from-fuchsia-600',
    via: 'via-violet-300',
    to: 'to-purple-200',
  },
  ground: { from: 'from-amber-600', via: 'via-yellow-300', to: 'to-stone-200' },
  flying: { from: 'from-indigo-500', via: 'via-sky-300', to: 'to-cyan-200' },
  psychic: { from: 'from-pink-500', via: 'via-rose-300', to: 'to-fuchsia-200' },
  bug: { from: 'from-lime-500', via: 'via-emerald-300', to: 'to-green-200' },
  rock: { from: 'from-stone-500', via: 'via-amber-300', to: 'to-yellow-200' },
  ghost: {
    from: 'from-violet-600',
    via: 'via-indigo-300',
    to: 'to-violet-200',
  },
  dragon: { from: 'from-sky-600', via: 'via-indigo-300', to: 'to-violet-200' },
  dark: { from: 'from-slate-700', via: 'via-slate-600', to: 'to-slate-400' },
  steel: { from: 'from-gray-400', via: 'via-zinc-300', to: 'to-stone-200' },
  fairy: { from: 'from-rose-400', via: 'via-pink-300', to: 'to-fuchsia-200' },
};
