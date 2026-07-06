import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/session";
import CheckoutForm from "@/components/CheckoutForm";

export const metadata: Metadata = { title: "Checkout — ShopBase" };

export default async function CheckoutPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?callbackUrl=/checkout");

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Checkout</h1>
      <CheckoutForm defaultName={user.name ?? ""} defaultEmail={user.email ?? ""} />
    </main>
  );
}
