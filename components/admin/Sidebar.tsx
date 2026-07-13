"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

const NAV = [
  { href: "/admin",             label: "Dashboard"  },
  { href: "/admin/products",    label: "Products"   },
  { href: "/admin/categories",  label: "Categories" },
  { href: "/admin/orders",      label: "Orders"     },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <aside className="flex w-52 shrink-0 flex-col border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-1 flex-col gap-1 p-3">
        <p className="mb-2 px-2 pt-1 text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
          Admin
        </p>

        {NAV.map(({ href, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white"
                  : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </div>

      <div className="border-t border-zinc-100 p-3 dark:border-zinc-800">
        {session?.user?.email && (
          <p className="truncate px-3 pb-1 text-xs text-zinc-400" title={session.user.email}>
            {session.user.email}
          </p>
        )}
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full rounded-lg px-3 py-2 text-left text-xs text-zinc-400 transition-colors hover:text-zinc-900 dark:hover:text-white"
        >
          Sign out
        </button>
        <Link
          href="/"
          className="block rounded-lg px-3 py-2 text-xs text-zinc-400 transition-colors hover:text-zinc-900 dark:hover:text-white"
        >
          ← View Store
        </Link>
      </div>
    </aside>
  );
}
