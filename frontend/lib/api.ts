import type { PokemonListEnrichedResponse } from '../../shared/types/pokemon';

function getBaseUrl() {
  const raw = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001';
  // Normalize: trim spaces, strip surrounding quotes, and trailing slash
  const trimmed = raw.trim();
  const unquoted = trimmed.replace(/^['"]+|['"]+$/g, '');
  return unquoted.endsWith('/') ? unquoted.slice(0, -1) : unquoted;
}

function joinUrl(base: string, path: string) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  try {
    return new URL(normalizedPath, base).toString();
  } catch {
    // Fallback concatenation
    return `${base}${normalizedPath}`;
  }
}

export async function apiGet<T = any>(path: string): Promise<T> {
  const url = joinUrl(getBaseUrl(), path);
  const res = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error(`GET ${path} failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function apiPost<T = any>(path: string, body: any): Promise<T> {
  const url = joinUrl(getBaseUrl(), path);
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`POST ${path} failed: ${res.status} ${text}`);
  }
  return res.json() as Promise<T>;
}

export function getPokemonList(offset = 0, limit = 20) {
  return apiGet<PokemonListEnrichedResponse>(
    `/pokemon?offset=${offset}&limit=${limit}`
  );
}
