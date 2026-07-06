import type { Metadata } from "next";
import Sidebar from "@/components/admin/Sidebar";
import { requireAdmin } from "@/lib/session";

export const metadata: Metadata = { title: "Admin — ShopBase" };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Belt-and-suspenders: proxy.ts already gate-keeps /admin/:path*, but
  // Next.js recommends checking again close to the data/render layer since
  // a matcher change could silently remove proxy coverage.
  await requireAdmin();

  return (
    <div className="flex flex-1">
      <Sidebar />
      <div className="flex-1 bg-zinc-50 dark:bg-zinc-950">
        <div className="mx-auto max-w-5xl px-8 py-10">{children}</div>
      </div>
    </div>
  );
}
