import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold">Pokedex</h1>
      <nav className="mt-4 flex gap-4">
        <Link href="/list" className="text-blue-600 hover:underline">
          List
        </Link>
        <Link href="/battle" className="text-blue-600 hover:underline">
          Battle
        </Link>
      </nav>
      <p className="mt-4 text-slate-600">
        Welcome to the Pokedex monolith boilerplate.
      </p>
    </main>
  );
}
