import Link from 'next/link';
import Image from 'next/image';
import PokeballIcon from '../components/icons/PokeballIcon';
import { ChevronRightIcon } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="relative overflow-hidden min-h-dvh">
      {/* Background: blurred anime forest + readable overlay */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0">
          <Image
            src="/field-flowing-stream-beautiful-natural-600nw-2428964117.webp"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-70 blur-sm"
          />
        </div>
        <div className="absolute inset-0 bg-linear-to-b from-background/30 via-black/20 to-black/40" />
        <div className="absolute inset-0 bg-polka-dots opacity-[0.12]" />
      </div>

      <div className="page-container relative">
        <header className="page-header">
          <div className="inline-flex items-center gap-4">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-rose-500  backdrop-blur">
              <PokeballIcon className="text-white" strokeWidth={2} size={20} />
            </span>
            <div className="font-pokemon font-bold">POKEDEX</div>
          </div>

          <nav className="flex items-center gap-2">
            <Link href="/list" className="btn-outline">
              Browse list
            </Link>
            <Link href="/battle" className="btn-solid">
              Start battle
            </Link>
          </nav>
        </header>

        <section className="grid items-center gap-10 py-10 lg:grid-cols-2 lg:py-14">
          <div className="max-w-xl">
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Catch, browse, and battle all in one
              <span className="text-rose-500"> Pokedex.</span>
            </h1>
            <p className="mt-4 text-base leading-relaxed text-slate-700">
              Explore the full list, open a Pokémon detail page, or jump into a
              quick battle.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <Link href="/list" className="btn-solid">
                Browse Pokémon
              </Link>
              <Link href="/battle" className="btn-outline">
                Battle mode
              </Link>
              <Link href="/pokemon/1" className="btn-ghost">
                Try Bulbasaur <ChevronRightIcon className="w-4 h-4" />
              </Link>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-white/70 p-4 ring-1 ring-slate-200 backdrop-blur">
                <div className="text-xs font-semibold text-slate-900">
                  Fast browse
                </div>
                <div className="mt-1 text-xs text-slate-600">
                  Paginated list with details.
                </div>
              </div>
              <div className="rounded-2xl bg-white/70 p-4 ring-1 ring-slate-200 backdrop-blur">
                <div className="text-xs font-semibold text-slate-900">
                  Battle
                </div>
                <div className="mt-1 text-xs text-slate-600">
                  Quick matchups and outcomes.
                </div>
              </div>
              <div className="rounded-2xl bg-white/70 p-4 ring-1 ring-slate-200 backdrop-blur">
                <div className="text-xs font-semibold text-slate-900">
                  Clean UI
                </div>
                <div className="mt-1 text-xs text-slate-600">
                  Modern, readable, responsive.
                </div>
              </div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div
              aria-hidden
              className="absolute -inset-6 rounded-[2.5rem] bg-linear-to-br from-cyan-400 via-transparent to-emerald-400 blur-2xl"
            />

            <div className="relative aspect-2/1 w-full">
              <Image
                src="/pokedex.png"
                alt="Pokedex device"
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 560px"
                className="select-none object-contain"
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
