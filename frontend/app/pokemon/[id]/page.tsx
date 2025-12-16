interface PokemonPageProps {
	params: { id: string };
}

export default function PokemonDetailPage({ params }: PokemonPageProps) {
	return (
		<main style={{ padding: 24 }}>
			<h2>Pokémon Detail (placeholder)</h2>
			<p>Pokémon ID: {params.id}</p>
		</main>
	);
}


