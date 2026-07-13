import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/session";
import { getOrderById } from "@/lib/orders";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = { title: "Order details — ShopBase" };

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  PAID: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  SHIPPED: "bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-400",
  CANCELLED: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400",
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AccountOrderDetailPage({ params }: Props) {
  const { id } = await params;

  const user = await getCurrentUser();
  if (!user) redirect(`/login?callbackUrl=/account/orders/${id}`);

  const order = await getOrderById(id, user.id);
  if (!order) notFound();

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <Link href="/account/orders" className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white">
        ← Back to orders
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Order details</h1>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            STATUS_STYLES[order.status] ?? "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
          }`}
        >
          {order.status}
        </span>
      </div>

      <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
          <span className="text-zinc-500">
            Order <span className="font-mono text-zinc-900 dark:text-white">{order.id}</span>
          </span>
          <span className="text-zinc-500">
            {new Date(order.createdAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>

        <ul className="mt-6 divide-y divide-zinc-100 dark:divide-zinc-800">
          {order.items.map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-4 py-3 text-sm">
              <div>
                <p className="font-medium text-zinc-900 dark:text-white">{item.productName}</p>
                <p className="text-zinc-500">
                  {formatPrice(item.price)} × {item.quantity}
                </p>
              </div>
              <span className="font-semibold text-zinc-900 dark:text-white">
                {formatPrice(item.price * item.quantity)}
              </span>
            </li>
          ))}
        </ul>

        <dl className="mt-4 space-y-3 border-t border-zinc-200 pt-4 text-sm dark:border-zinc-700">
          <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
            <dt>Subtotal</dt>
            <dd className="font-medium text-zinc-900 dark:text-white">{formatPrice(order.subtotal)}</dd>
          </div>
          <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
            <dt>Shipping</dt>
            <dd className="text-emerald-600">Free</dd>
          </div>
          <div className="border-t border-zinc-200 pt-3 dark:border-zinc-700">
            <div className="flex justify-between font-semibold text-zinc-900 dark:text-white">
              <dt>Total</dt>
              <dd>{formatPrice(order.total)}</dd>
            </div>
          </div>
        </dl>

        <div className="mt-6 border-t border-zinc-200 pt-6 text-sm dark:border-zinc-700">
          <p className="font-medium text-zinc-900 dark:text-white">Shipping to</p>
          <p className="mt-1 text-zinc-500">
            {order.shippingName}
            <br />
            {order.shippingAddress}
            <br />
            {order.shippingCity}, {order.shippingState} {order.shippingZip}
            <br />
            {order.shippingCountry}
          </p>
        </div>
      </div>
    </main>
  );
}
