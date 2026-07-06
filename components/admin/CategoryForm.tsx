"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Category } from "@/models/types";

function Field({
  label,
  error,
  required,
  hint,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-zinc-400">{hint}</p>}
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

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

interface FormState {
  name: string;
  slug: string;
  description: string;
}

interface FormErrors {
  name?: string;
  slug?: string;
}

interface Props {
  category?: Category;
}

export default function CategoryForm({ category }: Props) {
  const router = useRouter();
  const isEdit = Boolean(category);

  const [form, setForm] = useState<FormState>({
    name:        category?.name        ?? "",
    slug:        category?.slug        ?? "",
    description: category?.description ?? "",
  });

  // Track whether the user has manually edited the slug field
  const [slugEdited, setSlugEdited] = useState(isEdit);
  const [errors, setErrors]           = useState<FormErrors>({});
  const [submitting, setSubmitting]   = useState(false);
  const [serverError, setServerError] = useState("");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setForm((prev) => ({
      ...prev,
      name,
      // Auto-fill slug from name unless the user has manually changed it
      slug: slugEdited ? prev.slug : slugify(name),
    }));
    setErrors((prev) => ({ ...prev, name: undefined }));
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlugEdited(true);
    setForm((prev) => ({ ...prev, slug: e.target.value }));
    setErrors((prev) => ({ ...prev, slug: undefined }));
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, description: e.target.value }));
  };

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.slug.trim()) e.slug = "Slug is required";
    else if (!/^[a-z0-9-]+$/.test(form.slug))
      e.slug = "Only lowercase letters, numbers, and hyphens";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setServerError("");

    const res = await fetch(
      isEdit ? `/api/admin/categories/${category!.id}` : "/api/admin/categories",
      {
        method:  isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(form),
      }
    );

    if (res.ok) {
      router.push("/admin/categories");
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
            onChange={handleNameChange}
            placeholder="Apparel"
            className={inputClass(!!errors.name)}
          />
        </Field>

        <Field
          label="Slug"
          error={errors.slug}
          required
          hint={`URL: /categories/${form.slug || "…"}`}
        >
          <input
            type="text"
            value={form.slug}
            onChange={handleSlugChange}
            placeholder="apparel"
            className={inputClass(!!errors.slug)}
          />
        </Field>
      </div>

      <Field label="Description">
        <textarea
          value={form.description}
          onChange={handleDescriptionChange}
          rows={3}
          placeholder="A short description of this category…"
          className={inputClass()}
        />
      </Field>

      <div className="flex items-center gap-3 border-t border-zinc-100 pt-6 dark:border-zinc-800">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {submitting ? "Saving…" : isEdit ? "Save changes" : "Create category"}
        </button>
        <Link
          href="/admin/categories"
          className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-white"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
