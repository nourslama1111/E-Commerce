import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { getProducts } from "@/lib/products";
import ProductGrid from "@/components/ProductGrid";
import CategorySidebar from "@/components/CategorySidebar";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cat = await prisma.category.findUnique({ where: { slug } });
  return { title: cat ? `${cat.name} — ShopBase` : "Category Not Found" };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;

  const category = await prisma.category.findUnique({
    where: { slug },
    include: { _count: { select: { products: true } } },
  });

  if (!category) notFound();

  const { products } = await getProducts({ category: slug });

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex gap-8">
        {/* Sidebar */}
        <div className="hidden lg:block">
          <CategorySidebar activeSlug={slug} />
        </div>

        {/* Content */}
        <div className="flex-1">
          <nav className="mb-6 flex items-center gap-2 text-sm text-zinc-500">
            <Link
              href="/products"
              className="transition-colors hover:text-zinc-900 dark:hover:text-white"
            >
              Products
            </Link>
            <span>/</span>
            <span className="text-zinc-900 dark:text-white">{category.name}</span>
          </nav>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
              {category.name}
            </h1>
            {category.description && (
              <p className="mt-2 text-zinc-500">{category.description}</p>
            )}
            <p className="mt-1 text-sm text-zinc-400">
              {category._count.products}{" "}
              {category._count.products === 1 ? "product" : "products"}
            </p>
          </div>

          {products.length === 0 ? (
            <p className="text-zinc-500">No products in this category yet.</p>
          ) : (
            <ProductGrid products={products} />
          )}
        </div>
      </div>
    </main>
  );
}
