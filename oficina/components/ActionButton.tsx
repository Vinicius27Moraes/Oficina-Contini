"use client";

import { useState, type ReactNode } from "react";

export function ActionButton({
  action,
  children,
  confirmMessage,
}: {
  action: () => Promise<void>;
  children: ReactNode;
  confirmMessage?: string;
}) {
  const [pending, setPending] = useState(false);
  const [feedback, setFeedback] = useState<{ error: boolean; message: string } | null>(null);

  return (
    <span className="inline-flex flex-col items-end gap-1">
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (confirmMessage && !window.confirm(confirmMessage)) return;
          setFeedback(null);
          setPending(true);
          void action().then(
            () => setFeedback({ error: false, message: "Ação concluída." }),
            () => setFeedback({ error: true, message: "Não foi possível concluir a ação." }),
          ).finally(() => setPending(false));
        }}
        className="rounded-sm border border-graphite-600 px-3 py-1.5 text-xs font-semibold text-steel-300 hover:bg-graphite-700 disabled:cursor-wait disabled:opacity-60"
      >
        {pending ? "Processando…" : children}
      </button>
      {feedback && <span role={feedback.error ? "alert" : "status"} aria-live="polite" className={`text-[11px] ${feedback.error ? "text-red-300" : "text-emerald-300"}`}>{feedback.message}</span>}
    </span>
  );
}
