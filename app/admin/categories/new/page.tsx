import Link from "next/link";
import CategoryForm from "@/components/admin/CategoryForm";

export default function NewCategoryPage() {
  return (
    <div>
      <nav className="mb-6 flex items-center gap-2 text-sm text-zinc-500">
        <Link
          href="/admin/categories"
          className="hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          Categories
        </Link>
        <span>/</span>
        <span className="text-zinc-900 dark:text-white">New</span>
      </nav>

      <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">New category</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Fill in the details to add a category to your store.
      </p>

      <div className="mt-8">
        <CategoryForm />
      </div>
    </div>
  );
}
