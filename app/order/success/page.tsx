import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/session";
import { getOrderByStripeSessionId } from "@/lib/orders";

export const metadata: Metadata = { title: "Finalizing your order — ShopBase" };

interface Props {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function OrderSuccessPage({ searchParams }: Props) {
  const { session_id: sessionId } = await searchParams;
  if (!sessionId) redirect("/");

  const user = await getCurrentUser();
  if (!user) redirect(`/login?callbackUrl=/order/success?session_id=${sessionId}`);

  const order = await getOrderByStripeSessionId(sessionId, user.id);
  if (order) redirect(`/order/${order.id}`);

  // The webhook usually lands within a second or two of Stripe redirecting
  // the browser here, but it's a separate request racing this one — so this
  // page polls by reloading itself rather than assuming the order exists yet.
  return (
    <main className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6 lg:px-8">
      <meta httpEquiv="refresh" content="2" />
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Finalizing your order…</h1>
      <p className="mt-2 text-zinc-500">
        Payment received — we&apos;re just confirming the details. This page will refresh
        automatically.
      </p>
    </main>
  );
}
