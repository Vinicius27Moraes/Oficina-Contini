import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  action,
}: {
  eyebrow: string;
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col items-start justify-between gap-3 border-b border-graphite-700 pb-4 sm:flex-row sm:items-end">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-400">{eyebrow}</p>
        <h1 className="font-display text-3xl font-semibold text-paper">{title}</h1>
      </div>
      {action}
    </div>
  );
}
