import Link from "next/link";
import { prisma } from "@/lib/db";
import ProductForm from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div>
      <nav className="mb-6 flex items-center gap-2 text-sm text-zinc-500">
        <Link href="/admin/products" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
          Products
        </Link>
        <span>/</span>
        <span className="text-zinc-900 dark:text-white">New</span>
      </nav>

      <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">New product</h1>
      <p className="mt-1 text-sm text-zinc-500">Fill in the details to add a product to your store.</p>

      <div className="mt-8">
        <ProductForm categories={categories} />
      </div>
    </div>
  );
}
