'use client';

import { useState } from 'react';
import { apiPost } from '../../lib/api';

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
    <main style={{ padding: 24 }}>
      <h2>Battle (placeholder)</h2>
      <form
        onSubmit={submit}
        style={{ display: 'grid', gap: 8, maxWidth: 360 }}
      >
        <input
          placeholder="First Pokémon name"
          value={pokemon1}
          onChange={(e) => setPokemon1(e.target.value)}
          required
        />
        <input
          placeholder="Second Pokémon name"
          value={pokemon2}
          onChange={(e) => setPokemon2(e.target.value)}
          required
        />
        <button disabled={loading} type="submit">
          {loading ? 'Simulating...' : 'Simulate'}
        </button>
      </form>
      {error && <p style={{ color: 'crimson' }}>{error}</p>}
      {result && (
        <pre style={{ marginTop: 16, background: '#f5f5f5', padding: 12 }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </main>
  );
}
