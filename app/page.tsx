import { getFeaturedProducts } from "@/lib/products";
import ProductGrid from "@/components/ProductGrid";

export default async function HomePage() {
  const featured = await getFeaturedProducts(3);

  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="bg-zinc-950 py-24 text-center text-white">
        <div className="mx-auto max-w-2xl px-4">
          <h1 className="text-5xl font-bold tracking-tight">Quality goods, simply delivered.</h1>
          <p className="mt-4 text-lg text-zinc-400">A curated collection of everyday essentials.</p>
          <a
            href="/products"
            className="mt-8 inline-block rounded-full bg-white px-8 py-3 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-200"
          >
            Shop now
          </a>
        </div>
      </section>

      {/* Featured products */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-baseline justify-between">
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white">Featured</h2>
          <a
            href="/products"
            className="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-white"
          >
            View all →
          </a>
        </div>
        <div className="mt-8">
          <ProductGrid products={featured} />
        </div>
      </section>
    </main>
  );
}
