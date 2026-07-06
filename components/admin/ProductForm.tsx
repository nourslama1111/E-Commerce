"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Product } from "@/models/types";

// ─── Reusable field wrapper ───────────────────────────────────────────────────

function Field({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
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

// ─── Form ─────────────────────────────────────────────────────────────────────

interface FormState {
  name: string;
  description: string;
  price: string;
  image: string;
  categoryId: string;
  inStock: boolean;
}

interface FormErrors {
  name?: string;
  description?: string;
  price?: string;
  categoryId?: string;
}

interface Props {
  product?: Product;
  categories: { id: string; name: string }[];
}

export default function ProductForm({ product, categories }: Props) {
  const router = useRouter();
  const isEdit = Boolean(product);

  const [form, setForm] = useState<FormState>({
    name:        product?.name        ?? "",
    description: product?.description ?? "",
    price:       product?.price       ? String(product.price) : "",
    image:       product?.image       ?? "",
    categoryId:  product?.categoryId  ?? "",
    inStock:     product?.inStock     ?? true,
  });

  const [errors, setErrors]           = useState<FormErrors>({});
  const [submitting, setSubmitting]   = useState(false);
  const [serverError, setServerError] = useState("");

  const set = (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value =
        e.target instanceof HTMLInputElement && e.target.type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : e.target.value;
      setForm((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.name.trim())
      e.name = "Name is required";
    else if (form.name.trim().length < 2)
      e.name = "Name must be at least 2 characters";
    if (!form.description.trim())
      e.description = "Description is required";
    else if (form.description.trim().length < 10)
      e.description = "Description must be at least 10 characters";
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0)
      e.price = "Price must be a number greater than 0";
    if (!form.categoryId)
      e.categoryId = "Category is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setServerError("");

    const res = await fetch(
      isEdit ? `/api/admin/products/${product!.id}` : "/api/admin/products",
      {
        method:  isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, price: Number(form.price) }),
      }
    );

    if (res.ok) {
      router.push("/admin/products");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setServerError(data.error ?? "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      {serverError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
          {serverError}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Name" error={errors.name} required>
          <input
            type="text"
            value={form.name}
            onChange={set("name")}
            placeholder="Classic Tee"
            className={inputClass(!!errors.name)}
          />
        </Field>

        <Field label="Category" error={errors.categoryId} required>
          <select
            value={form.categoryId}
            onChange={set("categoryId")}
            className={inputClass(!!errors.categoryId)}
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Description" error={errors.description} required>
        <textarea
          value={form.description}
          onChange={set("description")}
          rows={3}
          placeholder="A short description of the product…"
          className={inputClass(!!errors.description)}
        />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Price (USD)" error={errors.price} required>
          <input
            type="number"
            value={form.price}
            onChange={set("price")}
            placeholder="29.99"
            step="0.01"
            min="0.01"
            className={inputClass(!!errors.price)}
          />
        </Field>

        <Field label="Image URL">
          <input
            type="url"
            value={form.image}
            onChange={set("image")}
            placeholder="https://…"
            className={inputClass()}
          />
        </Field>
      </div>

      <div className="flex items-center gap-3">
        <input
          id="inStock"
          type="checkbox"
          checked={form.inStock}
          onChange={set("inStock")}
          className="h-4 w-4 rounded border-zinc-300 accent-zinc-900"
        />
        <label htmlFor="inStock" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          In stock
        </label>
      </div>

      <div className="flex items-center gap-3 border-t border-zinc-100 pt-6 dark:border-zinc-800">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {submitting ? "Saving…" : isEdit ? "Save changes" : "Create product"}
        </button>
        <Link
          href="/admin/products"
          className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-white"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
