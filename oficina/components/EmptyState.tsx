import Link from "next/link";

export function EmptyState({
  title,
  description,
  actionHref,
  actionLabel,
}: {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-graphite-600 py-16 text-center">
      <p className="font-display text-xl text-steel-300">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-graphite-500">{description}</p>
      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className="mt-4 rounded-sm bg-amber-500 px-4 py-2 text-sm font-semibold text-graphite-950 transition hover:bg-amber-400"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
