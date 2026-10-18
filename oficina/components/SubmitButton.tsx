"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({ label, pendingLabel, disabled = false }: { label: string; pendingLabel?: string; disabled?: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className="rounded-sm bg-amber-500 px-4 py-2 text-sm font-semibold text-graphite-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? pendingLabel ?? "Salvando…" : label}
    </button>
  );
}
