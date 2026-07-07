"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

const inputClass = (hasError?: boolean) =>
  `w-full rounded-xl border px-4 py-2.5 text-sm bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none transition-colors ${
    hasError
      ? "border-red-400 focus:border-red-500 dark:border-red-500"
      : "border-zinc-200 focus:border-zinc-400 dark:border-zinc-700 dark:focus:border-zinc-500"
  }`;

interface FormState {
  name: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface Props {
  defaultName: string;
  defaultEmail: string;
}

export default function CheckoutForm({ defaultName, defaultEmail }: Props) {
  const { items, totalItems, totalPrice, clearCart } = useCart();

  const [form, setForm] = useState<FormState>({
    name: defaultName,
    email: defaultEmail,
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const set = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const e: Partial<FormState> = {};
    for (const field of Object.keys(form) as (keyof FormState)[]) {
      if (!form[field].trim()) e[field] = "Required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  if (items.length === 0) {
    return (
      <div className="mt-16 text-center">
        <p className="text-zinc-500">Your cart is empty — add something before checking out.</p>
        <Link
          href="/products"
          className="mt-6 inline-block rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Browse products
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setServerError("");

    const res = await fetch("/api/checkout/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map((item) => ({ productId: item.id, quantity: item.quantity })),
        shipping: form,
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok || !data.url) {
      setServerError(data.error ?? "Something went wrong. Please try again.");
      setSubmitting(false);
      return;
    }

    clearCart();
    window.location.href = data.url;
  };

  return (
    <form onSubmit={handleSubmit} className="mt-10 lg:grid lg:grid-cols-[1fr_360px] lg:gap-12">
      {/* Shipping details */}
      <div className="space-y-6">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Shipping details</h2>

        {serverError && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
            {serverError}
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Full name" error={errors.name}>
            <input
              type="text"
              value={form.name}
              onChange={set("name")}
              className={inputClass(!!errors.name)}
            />
          </Field>
          <Field label="Email" error={errors.email}>
            <input
              type="email"
              value={form.email}
              onChange={set("email")}
              className={inputClass(!!errors.email)}
            />
          </Field>
        </div>

        <Field label="Address" error={errors.address}>
          <input
            type="text"
            value={form.address}
            onChange={set("address")}
            placeholder="123 Main St"
            className={inputClass(!!errors.address)}
          />
        </Field>

        <div className="grid gap-6 sm:grid-cols-3">
          <Field label="City" error={errors.city}>
            <input
              type="text"
              value={form.city}
              onChange={set("city")}
              className={inputClass(!!errors.city)}
            />
          </Field>
          <Field label="State / Province" error={errors.state}>
            <input
              type="text"
              value={form.state}
              onChange={set("state")}
              className={inputClass(!!errors.state)}
            />
          </Field>
          <Field label="ZIP / Postal code" error={errors.zip}>
            <input
              type="text"
              value={form.zip}
              onChange={set("zip")}
              className={inputClass(!!errors.zip)}
            />
          </Field>
        </div>

        <Field label="Country" error={errors.country}>
          <input
            type="text"
            value={form.country}
            onChange={set("country")}
            className={inputClass(!!errors.country)}
          />
        </Field>
      </div>

      {/* Order summary */}
      <div className="mt-10 lg:mt-0">
        <div className="sticky top-24 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Order summary</h2>

          <ul className="mt-4 space-y-3 text-sm">
            {items.map((item) => (
              <li key={item.id} className="flex justify-between gap-3 text-zinc-600 dark:text-zinc-400">
                <span className="line-clamp-1">
                  {item.name} <span className="text-zinc-400">× {item.quantity}</span>
                </span>
                <span className="shrink-0 font-medium text-zinc-900 dark:text-white">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>

          <dl className="mt-4 space-y-3 border-t border-zinc-200 pt-4 text-sm dark:border-zinc-700">
            <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
              <dt>Subtotal ({totalItems} {totalItems === 1 ? "item" : "items"})</dt>
              <dd className="font-medium text-zinc-900 dark:text-white">{formatPrice(totalPrice)}</dd>
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

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full rounded-full bg-zinc-900 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {submitting ? "Redirecting to payment…" : "Place order"}
          </button>

          <Link
            href="/cart"
            className="mt-3 block text-center text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-white"
          >
            ← Back to cart
          </Link>
        </div>
      </div>
    </form>
  );
}
