import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/models/types";
import AddToCartButton from "./AddToCartButton";

const CATEGORY_BG: Record<string, string> = {
  Apparel: "bg-blue-50 dark:bg-blue-950",
  Accessories: "bg-amber-50 dark:bg-amber-950",
  Bags: "bg-emerald-50 dark:bg-emerald-950",
  Home: "bg-rose-50 dark:bg-rose-950",
};

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const imageBg = CATEGORY_BG[product.category] ?? "bg-zinc-100 dark:bg-zinc-800";

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
      <Link href={`/product/${product.id}`} className="block shrink-0">
        <div className={`h-52 w-full transition-opacity group-hover:opacity-80 ${imageBg}`} />
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
          {product.category}
        </p>
        <Link href={`/product/${product.id}`}>
          <h3 className="mt-1 text-base font-semibold text-zinc-900 hover:underline dark:text-white">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 flex-1 text-sm text-zinc-500">{product.description}</p>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-bold text-zinc-900 dark:text-white">
            {formatPrice(product.price)}
          </span>
          <AddToCartButton product={product} className="px-4 py-2 text-sm" />
        </div>
      </div>
    </div>
  );
}
