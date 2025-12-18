import Link from 'next/link';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  basePath: string; // e.g. "/list"
  pageParam?: string; // default: "page"
  siblingCount?: number; // default: 1
  className?: string;
};

function createPageRange(
  current: number,
  total: number,
  siblingCount: number
): (number | '...')[] {
  const totalNumbers = siblingCount * 2 + 5; // first, last, current, 2*siblings, and 2 ellipses
  if (total <= totalNumbers) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const leftSiblingIndex = Math.max(current - siblingCount, 1);
  const rightSiblingIndex = Math.min(current + siblingCount, total);
  const showLeftEllipsis = leftSiblingIndex > 2;
  const showRightEllipsis = rightSiblingIndex < total - 1;

  const pages: (number | '...')[] = [1];

  if (showLeftEllipsis) {
    pages.push('...');
  }

  for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
    if (i !== 1 && i !== total) pages.push(i);
  }

  if (showRightEllipsis) {
    pages.push('...');
  }

  if (total > 1) pages.push(total);

  return pages;
}

export default function Pagination({
  currentPage,
  totalPages,
  basePath,
  pageParam = 'page',
  siblingCount = 1,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const prevPage = Math.max(1, currentPage - 1);
  const nextPage = Math.min(totalPages, currentPage + 1);
  const disabledPrev = currentPage === 1;
  const disabledNext = currentPage === totalPages;

  const pages = createPageRange(currentPage, totalPages, siblingCount);

  const toWithPage = (p: number) => {
    const url = new URL(basePath, 'http://localhost'); // base for URL formatting only
    url.searchParams.set(pageParam, String(p));
    // Remove origin part; keep path + search
    return url.pathname + url.search;
  };

  const baseClasses =
    'inline-flex items-center justify-center rounded border border-slate-300 px-3 py-1.5 text-sm bg-white hover:bg-slate-50';

  return (
    <nav
      aria-label="Pagination"
      className={className ?? 'flex items-center justify-between gap-2'}
    >
      <Link
        aria-disabled={disabledPrev}
        className={`${baseClasses} ${
          disabledPrev ? 'pointer-events-none opacity-50' : ''
        }`}
        href={toWithPage(prevPage)}
      >
        ← Prev
      </Link>
      <div className="flex items-center gap-1">
        {pages.map((p, idx) =>
          p === '...' ? (
            <span key={`dots-${idx}`} className="px-2 text-slate-500">
              …
            </span>
          ) : (
            <Link
              key={p}
              href={toWithPage(p)}
              aria-current={p === currentPage ? 'page' : undefined}
              className={`${baseClasses} ${
                p === currentPage
                  ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-600'
                  : ''
              }`}
            >
              {p}
            </Link>
          )
        )}
      </div>
      <Link
        aria-disabled={disabledNext}
        className={`${baseClasses} ${
          disabledNext ? 'pointer-events-none opacity-50' : ''
        }`}
        href={toWithPage(nextPage)}
      >
        Next →
      </Link>
    </nav>
  );
}

