interface Props {
  label: string;
  value: number | string;
}

export default function StatCard({ label, value }: Props) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <p className="text-sm font-medium text-zinc-500">{label}</p>
      <p className="mt-2 text-4xl font-bold tabular-nums text-zinc-900 dark:text-white">
        {value}
      </p>
    </div>
  );
}
