import Link from "next/link";
import CartIcon from "./CartIcon";
import AuthNav from "./AuthNav";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/90 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
          ShopBase
        </Link>

        <nav className="hidden gap-8 text-sm font-medium text-zinc-600 dark:text-zinc-400 sm:flex">
          <Link href="/" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
            Home
          </Link>
          <Link href="/products" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
            Products
          </Link>
          <Link href="/admin" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
            Admin
          </Link>
        </nav>

        <div className="flex items-center gap-5">
          <CartIcon />
          <AuthNav />
        </div>
      </div>
    </header>
  );
}
