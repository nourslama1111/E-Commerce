import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Products</h1>
          <p className="mt-1 text-sm text-zinc-500">{products.length} total</p>
        </div>
        <Link
          href="/admin/products/new"
          className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          + New product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="mt-16 text-center text-zinc-500">
          No products yet.{" "}
          <Link href="/admin/products/new" className="underline hover:text-zinc-900 dark:hover:text-white">
            Create one
          </Link>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <table className="w-full text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
              <tr>
                {["Name", "Category", "Price", "Stock", "Actions"].map((h) => (
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
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900">
                  <td className="px-5 py-4 font-medium text-zinc-900 dark:text-white">
                    {p.name}
                  </td>
                  <td className="px-5 py-4 text-zinc-500">{p.category}</td>
                  <td className="px-5 py-4 text-zinc-900 dark:text-white">
                    {formatPrice(p.price)}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        p.inStock
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                          : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400"
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${p.inStock ? "bg-emerald-500" : "bg-red-400"}`} />
                      {p.inStock ? "In stock" : "Out of stock"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-4">
                      <Link
                        href={`/admin/products/${p.id}/edit`}
                        className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                      >
                        Edit
                      </Link>
                      <DeleteButton id={p.id} />
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
