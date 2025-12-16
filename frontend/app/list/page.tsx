import Link from 'next/link';

export default function ListPage() {
	return (
		<main style={{ padding: 24 }}>
			<h2>Pokémon List (placeholder)</h2>
			<p>Coming soon: list fetched from the NestJS backend.</p>
			<p style={{ marginTop: 16 }}>
				Example detail link: <Link href="/pokemon/1">Bulbasaur</Link>
			</p>
		</main>
	);
}


