import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import CategoryForm from "@/components/admin/CategoryForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditCategoryPage({ params }: Props) {
  const { id } = await params;
  const category = await prisma.category.findUnique({ where: { id } });

  if (!category) notFound();

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
        <span className="text-zinc-900 dark:text-white">{category.name}</span>
      </nav>

      <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Edit category</h1>
      <p className="mt-1 text-sm text-zinc-500">Update the category details below.</p>

      <div className="mt-8">
        <CategoryForm category={category} />
      </div>
    </div>
  );
}
