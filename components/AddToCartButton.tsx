"use client";

import { useCart } from "@/context/CartContext";
import type { Product } from "@/models/types";

const BASE_STYLES =
  "rounded-full font-medium text-white bg-zinc-900 transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200";

export default function AddToCartButton({
  product,
  className = "",
}: {
  product: Product;
  className?: string;
}) {
  const { addItem } = useCart();

  return (
    <button
      disabled={!product.inStock}
      onClick={product.inStock ? () => addItem(product) : undefined}
      className={`${BASE_STYLES} ${className}`}
    >
      {product.inStock ? "Add to cart" : "Out of stock"}
    </button>
  );
}
