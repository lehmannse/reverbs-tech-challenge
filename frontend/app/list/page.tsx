import { getPokemonList } from '../../lib/api';
import PokemonCard from '../../components/PokemonCard';
import Pagination from '../../components/Pagination';
import BackButton from '../../components/BackButton';
import { PokemonSummary } from '../../../shared/types/pokemon';

export default async function ListPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const limit = 20;
  const raw = searchParams?.page;
  const pageStr = Array.isArray(raw) ? raw[0] : raw ?? '1';
  const page = Math.max(1, Number(pageStr) || 1);
  const offset = (page - 1) * limit;

  const data = await getPokemonList(offset, limit);
  const totalPages = Math.max(1, Math.ceil(data.count / limit));

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <BackButton />
        <h2 className="text-2xl font-semibold">Pokémon List</h2>
        <div />
      </div>

      <Pagination
        className="mt-4"
        currentPage={page}
        totalPages={totalPages}
        basePath="/list"
      />

      <div className="mt-3 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3">
        {data.results.map((p: PokemonSummary, idx: number) => (
          <div
            key={p.id}
            className="card-enter"
            style={{ ['--stagger-index' as any]: idx }}
          >
            <PokemonCard item={p} />
          </div>
        ))}
      </div>

      <Pagination
        className="mt-6"
        currentPage={page}
        totalPages={totalPages}
        basePath="/list"
      />
    </main>
  );
}
