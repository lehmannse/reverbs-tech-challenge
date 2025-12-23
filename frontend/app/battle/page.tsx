'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { getPokemonList, simulateBattle } from '../../lib/api';
import BackButton from '../../components/BackButton';
import WatermarkedPage from '../../components/WatermarkedPage';
import PokemonCard from '../../components/PokemonCard';
import type { PokemonSummary } from '../../../shared/types/pokemon';
import type { BattleResultDto } from '../../../shared/types/battle';
import { AnimatePresence, motion } from 'motion/react';

export default function BattlePage() {
  const [selected1, setSelected1] = useState<PokemonSummary | null>(null);
  const [selected2, setSelected2] = useState<PokemonSummary | null>(null);
  const [activeSlot, setActiveSlot] = useState<1 | 2>(1);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [list, setList] = useState<PokemonSummary[]>([]);
  const [count, setCount] = useState(0);
  const limit = 24;

  const [result, setResult] = useState<BattleResultDto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoadingList(true);
      setError(null);
      try {
        const offset = (page - 1) * limit;
        const data = await getPokemonList(offset, limit);
        if (cancelled) return;
        setList(data.results ?? []);
        setCount(data.count ?? 0);
      } catch (e: any) {
        if (cancelled) return;
        setError(e?.message ?? 'Failed to load Pokémon list');
      } finally {
        if (!cancelled) setLoadingList(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [page]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter((p) => p.name.toLowerCase().includes(q));
  }, [list, search]);

  const totalPages = Math.max(1, Math.ceil(count / limit));

  const selectFromGrid = (p: PokemonSummary) => {
    if (activeSlot === 1) {
      setSelected1(p);
      if (!selected2) setActiveSlot(2);
    } else {
      setSelected2(p);
      if (!selected1) setActiveSlot(1);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      if (!selected1 || !selected2) {
        throw new Error('Select two Pokémon first.');
      }
      const res = await simulateBattle(selected1.id, selected2.id);
      setResult(res);
    } catch (err: any) {
      setError(err?.message ?? 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const narrationParagraphs = useMemo(() => {
    const raw = result?.narration ?? '';
    if (!raw) return [];
    // Prefer blank-line paragraphing; otherwise fall back to per-line paragraphs.
    const byBlankLines = raw
      .split(/\n{2,}/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (byBlankLines.length >= 2) return byBlankLines;
    return raw
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
  }, [result?.narration]);

  return (
    <WatermarkedPage
      showWatermark={false}
      background={
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <Image
            src="/pokemon-battle-background.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-30 blur-2xl"
          />
          <div className="absolute inset-0 bg-linear-to-b from-slate-50/70 via-slate-50/50 to-slate-50/90" />
        </div>
      }
      containerClassName="max-w-6xl"
    >
      <header className="page-header">
        <BackButton />
        <h2 className="page-title font-pokemon py-2 uppercase">Battle</h2>
        <div className="w-[68px]" />
      </header>

      <form onSubmit={submit} className="mt-6 grid gap-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl bg-white/70 p-4 ring-1 ring-slate-200 backdrop-blur">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-slate-900">
                Pokémon 1
              </div>
              <button
                type="button"
                onClick={() => setActiveSlot(1)}
                className={`btn-ghost btn-sm ${
                  activeSlot === 1 ? 'bg-white/80' : ''
                }`}
              >
                Picking
              </button>
            </div>
            <div className="mt-3 flex items-center justify-center">
              {selected1 ? (
                <PokemonCard
                  item={selected1}
                  onSelect={() => {
                    setSelected1(null);
                    setActiveSlot(1);
                  }}
                  selected
                />
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-6 text-center text-sm text-slate-600">
                  Select a Pokémon from the grid below.
                </div>
              )}
            </div>
          </div>

          <div className="rounded-3xl bg-white/70 p-4 ring-1 ring-slate-200 backdrop-blur">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-slate-900">
                Pokémon 2
              </div>
              <button
                type="button"
                onClick={() => setActiveSlot(2)}
                className={`btn-ghost btn-sm ${
                  activeSlot === 2 ? 'bg-white/80' : ''
                }`}
              >
                Picking
              </button>
            </div>
            <div className="mt-3 flex items-center justify-center">
              {selected2 ? (
                <PokemonCard
                  item={selected2}
                  onSelect={() => {
                    setSelected2(null);
                    setActiveSlot(2);
                  }}
                  selected
                />
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-6 text-center text-sm text-slate-600">
                  Select a Pokémon from the grid below.
                </div>
              )}
            </div>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {result?.narration ? (
            <motion.section
              key="battle-narration"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="relative overflow-hidden rounded-3xl bg-white/30 p-5 ring-1 ring-slate-200 backdrop-blur"
            >
              <div aria-hidden className="pointer-events-none absolute inset-0">
                <Image
                  src="/pokemon-battle-background.jpg"
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  className="object-cover object-center opacity-35 blur-[3px] scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-white/20 via-white/30 to-white/45" />
              </div>

              <div className="relative">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-slate-900">
                    Battle narration
                  </div>
                  {result?.winnerName ? (
                    <div className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                      Winner: {String(result.winnerName)}
                    </div>
                  ) : null}
                </div>

                <div className="mt-3 grid gap-3 text-sm leading-relaxed text-slate-800">
                  {narrationParagraphs.map((p, idx) => (
                    <motion.p
                      key={`${idx}-${p.slice(0, 24)}`}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 3 / narrationParagraphs.length,
                        ease: 'easeOut',
                        delay: (3 / narrationParagraphs.length) * idx,
                      }}
                      className="whitespace-pre-line"
                    >
                      {p}
                    </motion.p>
                  ))}
                </div>

                <div className="mt-4 text-[11px] text-slate-500">
                  {result?.model ? `model: ${String(result.model)}` : null}
                </div>
              </div>
            </motion.section>
          ) : null}
        </AnimatePresence>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <input
              placeholder="Filter current page (e.g. pika)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-72 rounded-full border border-slate-300 bg-white/80 px-4 py-2 text-slate-900 placeholder:text-slate-400 backdrop-blur focus:outline-none focus:ring-2 focus:ring-slate-900/15"
            />
            <div className="text-xs text-slate-600">
              Page {page} / {totalPages}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="btn-outline btn-sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || loadingList}
            >
              Prev
            </button>
            <button
              type="button"
              className="btn-outline btn-sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || loadingList}
            >
              Next
            </button>
            <button
              disabled={loading || !selected1 || !selected2}
              type="submit"
              className="btn-solid btn-sm"
            >
              {loading ? 'Battling…' : 'Simulate battle'}
            </button>
          </div>
        </div>

        <div className="rounded-3xl bg-white/60 p-4 ring-1 ring-slate-200 backdrop-blur">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-semibold text-slate-900">
              Pick a Pokémon
            </div>
            <div className="text-xs text-slate-600">
              Click a card to assign to Pokémon {activeSlot}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-6">
            {(loadingList ? Array.from({ length: 6 }) : filtered).map(
              (p: any, idx: number) => {
                if (loadingList) {
                  return (
                    <div
                      key={`s-${idx}`}
                      className="h-[116px] rounded-2xl bg-slate-200/50 animate-pulse"
                    />
                  );
                }

                const isSelected =
                  p.id === selected1?.id || p.id === selected2?.id;
                return (
                  <div
                    key={p.id}
                    className="card-enter flex items-center justify-center"
                    style={{ ['--stagger-index' as any]: idx }}
                  >
                    <PokemonCard
                      // key={p.id}
                      item={p}
                      onSelect={() => selectFromGrid(p)}
                      selected={isSelected}
                    />
                  </div>
                );
              }
            )}
          </div>
        </div>
      </form>

      {error && (
        <p className="mt-4 rounded-2xl bg-red-50 p-3 text-sm text-red-700 ring-1 ring-red-200">
          {error}
        </p>
      )}
    </WatermarkedPage>
  );
}
