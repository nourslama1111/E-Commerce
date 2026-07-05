import type { Metadata } from "next";
import Sidebar from "@/components/admin/Sidebar";

export const metadata: Metadata = { title: "Admin — ShopBase" };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1">
      <Sidebar />
      <div className="flex-1 bg-zinc-50 dark:bg-zinc-950">
        <div className="mx-auto max-w-5xl px-8 py-10">{children}</div>
      </div>
    </div>
  );
}
