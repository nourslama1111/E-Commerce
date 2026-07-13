import Link from "next/link";
import type { OrderStatus } from "@prisma/client";
import { getOrdersForAdmin } from "@/lib/orders";
import { formatPrice } from "@/lib/utils";
import Pagination from "@/components/Pagination";

const STATUSES: OrderStatus[] = ["PENDING", "PAID", "SHIPPED", "CANCELLED"];

const STATUS_STYLES: Record<OrderStatus, string> = {
  PENDING: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  PAID: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  SHIPPED: "bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-400",
  CANCELLED: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400",
};

interface Props {
  searchParams: Promise<{ status?: string; page?: string }>;
}

function isOrderStatus(value: string | undefined): value is OrderStatus {
  return STATUSES.includes(value as OrderStatus);
}

export default async function AdminOrdersPage({ searchParams }: Props) {
  const { status: statusParam, page } = await searchParams;
  const status = isOrderStatus(statusParam) ? statusParam : undefined;
  const currentPage = Math.max(1, Number(page) || 1);

  const { orders, total, totalPages } = await getOrdersForAdmin({ status, page: currentPage });

  const buildStatusUrl = (s?: OrderStatus) => {
    const params = new URLSearchParams();
    if (s) params.set("status", s);
    const qs = params.toString();
    return `/admin/orders${qs ? `?${qs}` : ""}`;
  };

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Orders</h1>
        <p className="mt-1 text-sm text-zinc-500">{total} total</p>
      </div>

      {/* Status filters */}
      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href={buildStatusUrl()}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            !status
              ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
              : "border border-zinc-200 text-zinc-600 hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-400"
          }`}
        >
          All
        </Link>
        {STATUSES.map((s) => (
          <Link
            key={s}
            href={buildStatusUrl(s)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              status === s
                ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                : "border border-zinc-200 text-zinc-600 hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-400"
            }`}
          >
            {s}
          </Link>
        ))}
      </div>

      {orders.length === 0 ? (
        <div className="mt-16 text-center text-zinc-500">No orders found.</div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <table className="w-full text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
              <tr>
                {["Order", "Customer", "Date", "Items", "Status", "Total"].map((h) => (
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
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900"
                >
                  <td className="px-5 py-4">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="font-mono font-medium text-zinc-900 hover:underline dark:text-white"
                    >
                      {order.id}
                    </Link>
                  </td>
                  <td className="px-5 py-4 text-zinc-500">
                    {order.user.name ?? order.user.email}
                  </td>
                  <td className="px-5 py-4 text-zinc-500">
                    {new Date(order.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="px-5 py-4 text-zinc-500">{order._count.items}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[order.status]}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-zinc-900 dark:text-white">
                    {formatPrice(order.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        searchParams={{ status }}
        basePath="/admin/orders"
      />
    </div>
  );
}
