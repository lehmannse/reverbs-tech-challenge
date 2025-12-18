interface PokemonPageProps {
  params: { id: string };
}

export default function PokemonDetailPage({ params }: PokemonPageProps) {
  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold">Pokémon Detail (placeholder)</h2>
      <p className="mt-2 text-slate-700">Pokémon ID: {params.id}</p>
    </main>
  );
}
