import type { ReactNode } from "react";

export function FormField({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-steel-300">
        {label}
      </label>
      {children}
      {error && <p className="text-xs font-medium text-red-400">{error}</p>}
    </div>
  );
}

export const inputClass =
  "rounded-sm border border-graphite-600 bg-graphite-900 px-3 py-2 text-sm text-paper placeholder:text-graphite-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500";
