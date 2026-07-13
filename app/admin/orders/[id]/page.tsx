import { notFound } from "next/navigation";
import Link from "next/link";
import type { OrderStatus } from "@prisma/client";
import { getOrderByIdAdmin } from "@/lib/orders";
import { formatPrice } from "@/lib/utils";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";

const STATUS_STYLES: Record<OrderStatus, string> = {
  PENDING: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  PAID: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  SHIPPED: "bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-400",
  CANCELLED: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400",
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminOrderDetailPage({ params }: Props) {
  const { id } = await params;

  const order = await getOrderByIdAdmin(id);
  if (!order) notFound();

  return (
    <div>
      <nav className="mb-6 flex items-center gap-2 text-sm text-zinc-500">
        <Link href="/admin/orders" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
          Orders
        </Link>
        <span>/</span>
        <span className="font-mono text-zinc-900 dark:text-white">{order.id}</span>
      </nav>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Order details</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Placed{" "}
            {new Date(order.createdAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}{" "}
            by {order.user.name ?? order.user.email}
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[order.status]}`}
          >
            {order.status}
          </span>
          <OrderStatusSelect id={order.id} status={order.status} />
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">Items</h2>
          <ul className="mt-4 divide-y divide-zinc-100 dark:divide-zinc-800">
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
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">Customer</h2>
          <p className="mt-2 text-sm text-zinc-500">
            {order.user.name ?? "—"}
            <br />
            {order.user.email}
          </p>

          <h2 className="mt-6 text-sm font-semibold text-zinc-900 dark:text-white">Shipping to</h2>
          <p className="mt-2 text-sm text-zinc-500">
            {order.shippingName}
            <br />
            {order.shippingAddress}
            <br />
            {order.shippingCity}, {order.shippingState} {order.shippingZip}
            <br />
            {order.shippingCountry}
          </p>

          {order.stripeSessionId && (
            <>
              <h2 className="mt-6 text-sm font-semibold text-zinc-900 dark:text-white">Payment</h2>
              <p className="mt-2 break-all font-mono text-xs text-zinc-500">{order.stripeSessionId}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
