import Link from "next/link";
import { prisma } from "@/lib/db";

interface Props {
  activeSlug?: string;
}

export default async function CategorySidebar({ activeSlug }: Props) {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });

  const linkClass = (active: boolean) =>
    `flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
      active
        ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
        : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
    }`;

  return (
    <aside className="w-44 shrink-0">
      <p className="mb-3 px-1 text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
        Categories
      </p>
      <nav className="flex flex-col gap-0.5">
        <Link href="/products" className={linkClass(!activeSlug)}>
          All products
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/products?category=${cat.slug}`}
            className={linkClass(activeSlug === cat.slug)}
          >
            <span>{cat.name}</span>
            <span
              className={`text-xs tabular-nums ${
                activeSlug === cat.slug
                  ? "text-zinc-300 dark:text-zinc-600"
                  : "text-zinc-400"
              }`}
            >
              {cat._count.products}
            </span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
