export default function AdminPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Admin Dashboard</h1>
      <p className="mt-2 text-zinc-500">Manage your store from here.</p>

      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        {[
          { label: "Products", count: 0 },
          { label: "Orders", count: 0 },
          { label: "Customers", count: 0 },
        ].map(({ label, count }) => (
          <div
            key={label}
            className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <p className="text-sm font-medium text-zinc-500">{label}</p>
            <p className="mt-2 text-4xl font-bold text-zinc-900 dark:text-white">{count}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
