import Link from "next/link";

interface Props {
  currentPage: number;
  totalPages: number;
  searchParams: { search?: string; category?: string; sort?: string };
}

function buildUrl(
  page: number,
  sp: { search?: string; category?: string; sort?: string }
): string {
  const params = new URLSearchParams();
  if (sp.search)   params.set("search",   sp.search);
  if (sp.category) params.set("category", sp.category);
  if (sp.sort)     params.set("sort",     sp.sort);
  params.set("page", String(page));
  return `/products?${params.toString()}`;
}

function getPageNumbers(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, "ellipsis", total];
  if (current >= total - 3)
    return [1, "ellipsis", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "ellipsis", current - 1, current, current + 1, "ellipsis", total];
}

const BASE =
  "flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-medium transition-colors";
const INACTIVE =
  "border-zinc-200 text-zinc-600 hover:border-zinc-400 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-500 dark:hover:text-white";
const ACTIVE =
  "border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-900";
const DISABLED =
  "border-zinc-100 text-zinc-300 cursor-not-allowed dark:border-zinc-800 dark:text-zinc-600";

export default function Pagination({ currentPage, totalPages, searchParams }: Props) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <nav
      className="mt-12 flex items-center justify-center gap-1"
      aria-label="Pagination"
    >
      {/* Previous */}
      {currentPage > 1 ? (
        <Link href={buildUrl(currentPage - 1, searchParams)} className={`${BASE} ${INACTIVE}`}>
          ←
        </Link>
      ) : (
        <span className={`${BASE} ${DISABLED}`}>←</span>
      )}

      {/* Page numbers */}
      {pages.map((p, i) =>
        p === "ellipsis" ? (
          <span key={`e${i}`} className="flex h-9 w-9 items-center justify-center text-sm text-zinc-400">
            …
          </span>
        ) : (
          <Link
            key={p}
            href={buildUrl(p, searchParams)}
            aria-current={p === currentPage ? "page" : undefined}
            className={`${BASE} ${p === currentPage ? ACTIVE : INACTIVE}`}
          >
            {p}
          </Link>
        )
      )}

      {/* Next */}
      {currentPage < totalPages ? (
        <Link href={buildUrl(currentPage + 1, searchParams)} className={`${BASE} ${INACTIVE}`}>
          →
        </Link>
      ) : (
        <span className={`${BASE} ${DISABLED}`}>→</span>
      )}
    </nav>
  );
}
