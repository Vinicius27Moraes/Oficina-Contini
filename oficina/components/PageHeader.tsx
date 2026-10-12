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
    <div className="mb-6 flex items-end justify-between border-b border-graphite-700 pb-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-400">{eyebrow}</p>
        <h1 className="font-display text-3xl font-semibold text-paper">{title}</h1>
      </div>
      {action}
    </div>
  );
}
