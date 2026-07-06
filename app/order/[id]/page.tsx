import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/session";
import { getOrderById } from "@/lib/orders";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = { title: "Order confirmed — ShopBase" };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function OrderConfirmationPage({ params }: Props) {
  const { id } = await params;

  const user = await getCurrentUser();
  if (!user) redirect(`/login?callbackUrl=/order/${id}`);

  const order = await getOrderById(id, user.id);
  if (!order) notFound();

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7 text-emerald-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="mt-6 text-3xl font-bold text-zinc-900 dark:text-white">Order confirmed</h1>
        <p className="mt-2 text-zinc-500">
          Thanks, {order.shippingName.split(" ")[0]} — we&apos;ve received your order.
        </p>
      </div>

      <div className="mt-10 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
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

      <div className="mt-8 text-center">
        <Link
          href="/products"
          className="inline-block rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Continue shopping
        </Link>
      </div>
    </main>
  );
}
