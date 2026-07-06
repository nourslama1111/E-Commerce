import type { Metadata } from "next";
import RegisterForm from "@/components/RegisterForm";

export const metadata: Metadata = { title: "Register — ShopBase" };

export default function RegisterPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-7xl flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-2xl font-bold text-zinc-900 dark:text-white">Create an account</h1>
      <RegisterForm />
    </main>
  );
}
