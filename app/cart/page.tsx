"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";

const CATEGORY_BG: Record<string, string> = {
  Apparel: "bg-blue-50 dark:bg-blue-950",
  Accessories: "bg-amber-50 dark:bg-amber-950",
  Bags: "bg-emerald-50 dark:bg-emerald-950",
  Home: "bg-rose-50 dark:bg-rose-950",
};

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalItems, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-32 text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 text-zinc-200 dark:text-zinc-700"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z"
          />
        </svg>
        <h2 className="mt-6 text-2xl font-semibold text-zinc-900 dark:text-white">
          Your cart is empty
        </h2>
        <p className="mt-2 text-zinc-500">Add some products to get started.</p>
        <Link
          href="/products"
          className="mt-8 rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Browse products
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
        Cart{" "}
        <span className="text-2xl font-normal text-zinc-400">({totalItems})</span>
      </h1>

      <div className="mt-10 lg:grid lg:grid-cols-[1fr_360px] lg:gap-12">
        {/* Item list */}
        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {items.map((item) => {
            const imageBg = CATEGORY_BG[item.category.name] ?? "bg-zinc-100 dark:bg-zinc-800";
            return (
              <div key={item.id} className="flex gap-5 py-6">
                <Link href={`/product/${item.id}`} className="shrink-0">
                  <div className={`h-24 w-24 rounded-xl ${imageBg}`} />
                </Link>

                <div className="flex flex-1 flex-col gap-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
                        {item.category.name}
                      </p>
                      <Link href={`/product/${item.id}`}>
                        <h3 className="font-semibold text-zinc-900 hover:underline dark:text-white">
                          {item.name}
                        </h3>
                      </Link>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      aria-label="Remove item"
                      className="ml-4 flex h-6 w-6 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <p className="text-sm text-zinc-500">{formatPrice(item.price)} each</p>

                  <div className="mt-auto flex items-center justify-between">
                    {/* Quantity stepper */}
                    <div className="flex items-center rounded-full border border-zinc-200 dark:border-zinc-700">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        aria-label="Decrease quantity"
                        className="flex h-8 w-8 items-center justify-center text-zinc-500 transition-colors hover:text-zinc-900 disabled:opacity-30 dark:hover:text-white"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm font-medium text-zinc-900 dark:text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        aria-label="Increase quantity"
                        className="flex h-8 w-8 items-center justify-center text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-white"
                      >
                        +
                      </button>
                    </div>

                    <span className="font-semibold text-zinc-900 dark:text-white">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order summary */}
        <div className="mt-10 lg:mt-0">
          <div className="sticky top-24 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
              Order summary
            </h2>

            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <dt>
                  Subtotal ({totalItems} {totalItems === 1 ? "item" : "items"})
                </dt>
                <dd className="font-medium text-zinc-900 dark:text-white">
                  {formatPrice(totalPrice)}
                </dd>
              </div>
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <dt>Shipping</dt>
                <dd className="text-emerald-600">Free</dd>
              </div>
              <div className="border-t border-zinc-200 pt-3 dark:border-zinc-700">
                <div className="flex justify-between font-semibold text-zinc-900 dark:text-white">
                  <dt>Total</dt>
                  <dd>{formatPrice(totalPrice)}</dd>
                </div>
              </div>
            </dl>

            <Link
              href="/checkout"
              className="mt-6 block w-full rounded-full bg-zinc-900 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Proceed to checkout
            </Link>

            <Link
              href="/products"
              className="mt-3 block text-center text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-white"
            >
              ← Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
