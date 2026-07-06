"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteButton({
  id,
  endpoint = "/api/admin/products",
}: {
  id: string;
  endpoint?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Delete this? This cannot be undone.")) return;
    setLoading(true);
    await fetch(`${endpoint}/${id}`, { method: "DELETE" });
    router.refresh();
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-sm text-red-500 transition-colors hover:text-red-700 disabled:opacity-40"
    >
      {loading ? "Deleting…" : "Delete"}
    </button>
  );
}
