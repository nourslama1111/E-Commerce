import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/session";
import { getOrdersByUser } from "@/lib/orders";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = { title: "Your orders — ShopBase" };

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  PAID: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  SHIPPED: "bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-400",
  CANCELLED: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400",
};

export default async function OrderHistoryPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?callbackUrl=/account/orders");

  const orders = await getOrdersByUser(user.id);

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Your orders</h1>

      {orders.length === 0 ? (
        <p className="mt-6 text-zinc-500">
          You haven&apos;t placed any orders yet.{" "}
          <Link href="/products" className="font-medium text-zinc-900 underline dark:text-white">
            Start shopping
          </Link>
          .
        </p>
      ) : (
        <ul className="mt-8 divide-y divide-zinc-100 rounded-2xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900">
          {orders.map((order) => (
            <li key={order.id}>
              <Link
                href={`/account/orders/${order.id}`}
                className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
              >
                <div>
                  <p className="font-mono text-sm text-zinc-900 dark:text-white">{order.id}</p>
                  <p className="mt-1 text-sm text-zinc-500">
                    {new Date(order.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}{" "}
                    · {order._count.items} item{order._count.items === 1 ? "" : "s"}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      STATUS_STYLES[order.status] ?? "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                    }`}
                  >
                    {order.status}
                  </span>
                  <span className="font-semibold text-zinc-900 dark:text-white">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
