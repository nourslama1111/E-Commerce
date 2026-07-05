import Link from "next/link";
import { Suspense } from "react";
import { getProducts } from "@/lib/products";
import { categories } from "@/lib/data";
import ProductGrid from "@/components/ProductGrid";
import SearchInput from "@/components/SearchInput";
import SortSelect from "@/components/SortSelect";
import Pagination from "@/components/Pagination";

interface Props {
  searchParams: Promise<{
    category?: string;
    search?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: Props) {
  const { category, search, sort, page } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);

  const { products, total, totalPages } = await getProducts({
    category,
    search,
    sort,
    page: currentPage,
  });

  // Category links preserve search + sort but reset page
  const buildCategoryUrl = (cat?: string) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (sort)   params.set("sort", sort);
    if (cat)    params.set("category", cat);
    const qs = params.toString();
    return `/products${qs ? `?${qs}` : ""}`;
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-baseline justify-between">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Products</h1>
        <p className="text-sm text-zinc-500">{total} items</p>
      </div>

      {/* Search + Sort */}
      <div className="mt-6 flex gap-3">
        <Suspense
          fallback={
            <div className="h-10 flex-1 animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-800" />
          }
        >
          <SearchInput />
        </Suspense>
        <Suspense
          fallback={
            <div className="h-10 w-44 animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-800" />
          }
        >
          <SortSelect />
        </Suspense>
      </div>

      {/* Category filters */}
      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href={buildCategoryUrl()}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            !category
              ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
              : "border border-zinc-200 text-zinc-600 hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-400"
          }`}
        >
          All
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat}
            href={buildCategoryUrl(cat)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              category === cat
                ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                : "border border-zinc-200 text-zinc-600 hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-400"
            }`}
          >
            {cat}
          </Link>
        ))}
      </div>

      {/* Results */}
      <div className="mt-8">
        <ProductGrid products={products} />
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        searchParams={{ category, search, sort }}
      />
    </main>
  );
}
