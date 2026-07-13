"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { OrderStatus } from "@prisma/client";

const STATUSES: OrderStatus[] = ["PENDING", "PAID", "SHIPPED", "CANCELLED"];

export default function OrderStatusSelect({ id, status }: { id: string; status: OrderStatus }) {
  const router = useRouter();
  const [value, setValue] = useState(status);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value as OrderStatus;
    const previous = value;
    setValue(next);
    setSaving(true);
    setError("");

    const res = await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });

    if (res.ok) {
      router.refresh();
    } else {
      setValue(previous);
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Failed to update status");
    }
    setSaving(false);
  };

  return (
    <div className="flex flex-col items-end gap-1.5">
      <select
        value={value}
        onChange={handleChange}
        disabled={saving}
        className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-900 focus:border-zinc-400 focus:outline-none disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
