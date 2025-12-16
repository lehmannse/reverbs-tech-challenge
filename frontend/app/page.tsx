import Link from 'next/link';

export default function HomePage() {
	return (
		<main style={{ padding: 24 }}>
			<h1>Pokedex</h1>
			<nav style={{ display: 'flex', gap: 16, marginTop: 16 }}>
				<Link href="/list">List</Link>
				<Link href="/battle">Battle</Link>
			</nav>
			<p style={{ marginTop: 16 }}>Welcome to the Pokedex monolith boilerplate.</p>
		</main>
	);
}


