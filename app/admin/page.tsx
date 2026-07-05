import { prisma } from "@/lib/db";
import StatCard from "@/components/admin/StatCard";

export default async function AdminDashboard() {
  const [total, inStock, outOfStock, grouped] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { inStock: true } }),
    prisma.product.count({ where: { inStock: false } }),
    prisma.product.groupBy({ by: ["category"] }),
  ]);

  const stats = [
    { label: "Total Products",  value: total },
    { label: "In Stock",        value: inStock },
    { label: "Out of Stock",    value: outOfStock },
    { label: "Categories",      value: grouped.length },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Dashboard</h1>
      <p className="mt-1 text-sm text-zinc-500">Overview of your store.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} />
        ))}
      </div>
    </div>
  );
}
