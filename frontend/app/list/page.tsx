import { getPokemonList } from '../../lib/api';
import PokemonCard from '../../components/PokemonCard';
import BackButton from '../../components/BackButton';
import Pagination from '../../components/Pagination';
import { PokemonSummary } from '../../../shared/types/pokemon';
import WatermarkedPage from '../../components/WatermarkedPage';

// Ensure this route is always dynamic and responds to query changes
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ListPage({
  searchParams,
}: {
  // Next.js 16 may provide searchParams as a Promise (sync dynamic APIs).
  searchParams?:
    | Promise<Record<string, string | string[] | undefined>>
    | Record<string, string | string[] | undefined>;
}) {
  const limit = 20;
  const sp = await Promise.resolve(searchParams ?? {});
  const pageStr = Array.isArray(sp.page) ? sp.page[0] : sp.page ?? '1';
  const page = Math.max(1, Number(pageStr) || 1);
  const offset = (page - 1) * limit;

  const data = await getPokemonList(offset, limit);
  const totalPages = Math.max(1, Math.ceil(data.count / limit));
  const currentPage = Math.max(1, Math.min(totalPages, page));
  const from = data.results.length ? offset + 1 : 0;
  const to = data.results.length ? offset + data.results.length : 0;

  return (
    <WatermarkedPage>
      <header className="page-header">
        <BackButton />
        <h2 className="page-title font-pokemon py-2 uppercase">Pokedex</h2>
        <div className="w-[68px]" />
      </header>

      <div className="mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          basePath="/list"
        />
      </div>

      <div className="mt-5 grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-6">
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

      <div className="mt-6">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          basePath="/list"
        />
      </div>
    </WatermarkedPage>
  );
}
