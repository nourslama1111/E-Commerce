import Link from "next/link";
import { prisma } from "@/lib/db";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Categories</h1>
          <p className="mt-1 text-sm text-zinc-500">{categories.length} total</p>
        </div>
        <Link
          href="/admin/categories/new"
          className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          + New category
        </Link>
      </div>

      {categories.length === 0 ? (
        <div className="mt-16 text-center text-zinc-500">
          No categories yet.{" "}
          <Link
            href="/admin/categories/new"
            className="underline hover:text-zinc-900 dark:hover:text-white"
          >
            Create one
          </Link>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <table className="w-full text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
              <tr>
                {["Name", "Slug", "Products", "Actions"].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 bg-white dark:divide-zinc-800 dark:bg-zinc-950">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900">
                  <td className="px-5 py-4 font-medium text-zinc-900 dark:text-white">
                    {cat.name}
                  </td>
                  <td className="px-5 py-4 font-mono text-xs text-zinc-500">{cat.slug}</td>
                  <td className="px-5 py-4 text-zinc-500">{cat._count.products}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-4">
                      <Link
                        href={`/admin/categories/${cat.id}/edit`}
                        className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                      >
                        Edit
                      </Link>
                      <DeleteButton
                        id={cat.id}
                        endpoint="/api/admin/categories"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
