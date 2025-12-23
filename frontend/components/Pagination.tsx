import Link from 'next/link';
import type { UrlObject } from 'url';

type PageItem = number | 'ellipsis';

function buildPageItems(
  current: number,
  total: number,
  siblingCount = 1
): PageItem[] {
  if (total <= 1) return [1];

  const clamp = (n: number) => Math.max(1, Math.min(total, n));
  const c = clamp(current);

  const first = 1;
  const last = total;
  const left = Math.max(first + 1, c - siblingCount);
  const right = Math.min(last - 1, c + siblingCount);

  const items: PageItem[] = [first];

  if (left > first + 1) items.push('ellipsis');
  for (let p = left; p <= right; p++) items.push(p);
  if (right < last - 1) items.push('ellipsis');

  if (last !== first) items.push(last);
  return items;
}

function hrefForPage(basePath: string, page: number): UrlObject {
  const normalizedBase = basePath.startsWith('/') ? basePath : `/${basePath}`;
  const url = new URL(normalizedBase, 'http://example.local');
  url.searchParams.set('page', String(page));

  return {
    pathname: url.pathname,
    query: Object.fromEntries(url.searchParams.entries()),
  };
}

export default function Pagination({
  currentPage,
  totalPages,
  basePath,
}: {
  currentPage: number;
  totalPages: number;
  basePath: string;
}) {
  const total = Math.max(1, totalPages);
  const current = Math.max(1, Math.min(total, currentPage));

  const items = buildPageItems(current, total, 1);
  const prev = Math.max(1, current - 1);
  const next = Math.min(total, current + 1);

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-wrap items-center justify-center gap-2"
    >
      <Link
        aria-disabled={current === 1}
        tabIndex={current === 1 ? -1 : 0}
        href={hrefForPage(basePath, prev)}
        className={`btn-outline btn-sm ${
          current === 1 ? 'pointer-events-none opacity-50' : ''
        }`}
      >
        Prev
      </Link>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {items.map((it, idx) => {
          if (it === 'ellipsis') {
            return (
              <span key={`e-${idx}`} className="px-2 text-sm text-slate-500">
                …
              </span>
            );
          }

          const isCurrent = it === current;
          return (
            <Link
              key={it}
              href={hrefForPage(basePath, it)}
              aria-current={isCurrent ? 'page' : undefined}
              className={isCurrent ? 'btn-solid btn-sm' : 'btn-ghost btn-sm'}
            >
              {it}
            </Link>
          );
        })}
      </div>

      <Link
        aria-disabled={current === total}
        tabIndex={current === total ? -1 : 0}
        href={hrefForPage(basePath, next)}
        className={`btn-outline btn-sm ${
          current === total ? 'pointer-events-none opacity-50' : ''
        }`}
      >
        Next
      </Link>
    </nav>
  );
}
