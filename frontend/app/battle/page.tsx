'use client';

import { useState } from 'react';
import { apiPost } from '../../lib/api';
import BackButton from '../../components/BackButton';

export default function BattlePage() {
  const [pokemon1, setPokemon1] = useState('');
  const [pokemon2, setPokemon2] = useState('');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const res = await apiPost('/battle/simulate', {
        pokemon1Name: pokemon1,
        pokemon2Name: pokemon2,
      });
      setResult(res);
    } catch (err: any) {
      setError(err?.message ?? 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <BackButton />
        <h2 className="text-2xl font-semibold">Battle (placeholder)</h2>
        <div />
      </div>
      <form onSubmit={submit} className="mt-4 grid gap-2 max-w-sm">
        <input
          placeholder="First Pokémon name"
          value={pokemon1}
          onChange={(e) => setPokemon1(e.target.value)}
          required
          className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          placeholder="Second Pokémon name"
          value={pokemon2}
          onChange={(e) => setPokemon2(e.target.value)}
          required
          className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          disabled={loading}
          type="submit"
          className="inline-flex items-center justify-center rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Simulating...' : 'Simulate'}
        </button>
      </form>
      {error && <p className="mt-2 text-red-600">{error}</p>}
      {result && (
        <pre className="mt-4 rounded bg-slate-100 p-3 text-sm text-slate-800 overflow-x-auto">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </main>
  );
}
