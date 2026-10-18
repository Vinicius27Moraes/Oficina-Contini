"use client";

import { useState, type ReactNode } from "react";

export function DeleteButton({
  action,
  confirmMessage = "Tem certeza que deseja excluir este registro?",
  children = "Excluir",
  disabled = false,
}: {
  action: () => Promise<void>;
  confirmMessage?: string;
  children?: ReactNode;
  disabled?: boolean;
}) {
  const [pending, setPending] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  return (
    <span className="inline-flex flex-col items-end gap-1">
      <button
        type="button"
        disabled={pending || disabled}
        onClick={() => {
          if (!window.confirm(confirmMessage)) return;
          setFeedback(null);
          setPending(true);
          void action().then(
            () => setFeedback({ type: "success", message: "Ação concluída." }),
            () => setFeedback({ type: "error", message: "Não foi possível concluir. Atualize a página e tente novamente." }),
          ).finally(() => setPending(false));
        }}
        className="rounded-sm border border-red-500/40 px-3 py-1.5 text-xs font-semibold text-red-300 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? "Processando…" : children}
      </button>
      {feedback && <span role={feedback.type === "error" ? "alert" : "status"} className={`text-[11px] ${feedback.type === "error" ? "text-red-300" : "text-emerald-300"}`}>{feedback.message}</span>}
    </span>
  );
}
