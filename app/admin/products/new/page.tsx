import Link from "next/link";
import ProductForm from "@/components/admin/ProductForm";

export default function NewProductPage() {
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
        <ProductForm />
      </div>
    </div>
  );
}
