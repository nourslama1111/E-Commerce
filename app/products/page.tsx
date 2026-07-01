import Link from "next/link";
import { products, categories } from "@/lib/data";
import ProductGrid from "@/components/ProductGrid";

interface Props {
  searchParams: Promise<{ category?: string }>;
}

export default async function ProductsPage({ searchParams }: Props) {
  const { category } = await searchParams;

  const filtered = category
    ? products.filter((p) => p.category === category)
    : products;

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex items-baseline justify-between">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Products</h1>
        <p className="text-sm text-zinc-500">{filtered.length} items</p>
      </div>

      {/* Category filters */}
      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href="/products"
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
            href={`/products?category=${cat}`}
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

      <div className="mt-8">
        <ProductGrid products={filtered} />
      </div>
    </main>
  );
}
