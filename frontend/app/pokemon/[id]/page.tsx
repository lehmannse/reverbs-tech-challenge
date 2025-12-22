import WatermarkedPage from '../../../components/WatermarkedPage';

interface PokemonPageProps {
  params: { id: string };
}

export default async function PokemonDetailPage({ params }: PokemonPageProps) {
  const { id } = await params;
  return (
    <WatermarkedPage containerClassName="max-w-3xl">
      <h2 className="text-2xl font-semibold">Pokémon Detail (placeholder)</h2>
      <p className="mt-2 text-slate-700">Pokémon ID: {id}</p>
    </WatermarkedPage>
  );
}
