import { getPokemonList } from '../../lib/api';
import PokemonCard from '../../components/PokemonCard';
import { PokemonSummary } from '../../../shared/types/pokemon';

export default async function ListPage() {
  const data = await getPokemonList(0, 20);
  return (
    <main className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold">Pokémon List</h2>
      <div className="mt-3 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3">
        {data.results.map((p: PokemonSummary) => (
          <PokemonCard key={p.id} item={p} />
        ))}
      </div>
    </main>
  );
}
