import { Suspense } from "react";
import type { Metadata } from "next";
import LoginForm from "@/components/LoginForm";

export const metadata: Metadata = { title: "Sign in — ShopBase" };

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-7xl flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-2xl font-bold text-zinc-900 dark:text-white">Sign in</h1>
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  );
}
