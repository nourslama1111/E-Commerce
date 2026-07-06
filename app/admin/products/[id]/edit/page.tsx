import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getProductById } from "@/lib/products";
import ProductForm from "@/components/admin/ProductForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    getProductById(id),
    prisma.category.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  if (!product) notFound();

  return (
    <div>
      <nav className="mb-6 flex items-center gap-2 text-sm text-zinc-500">
        <Link href="/admin/products" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
          Products
        </Link>
        <span>/</span>
        <span className="text-zinc-900 dark:text-white">{product.name}</span>
      </nav>

      <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Edit product</h1>
      <p className="mt-1 text-sm text-zinc-500">Update the product details below.</p>

      <div className="mt-8">
        <ProductForm product={product} categories={categories} />
      </div>
    </div>
  );
}
