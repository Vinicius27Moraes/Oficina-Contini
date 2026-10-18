"use client";

import { useState } from "react";
import { atualizarStatus } from "@/lib/actions/ordens";
import type { StatusOrdem } from "@prisma/client";

const OPCOES: { value: StatusOrdem; label: string }[] = [
  { value: "ABERTA", label: "Aberta" },
  { value: "EM_ANDAMENTO", label: "Em andamento" },
  { value: "AGUARDANDO_PECA", label: "Aguardando peça" },
  { value: "FINALIZADA", label: "Finalizada" },
  { value: "CANCELADA", label: "Cancelada" },
];

export function StatusControls({ ordemId, statusAtual }: { ordemId: string; statusAtual: StatusOrdem }) {
  const [isPending, setIsPending] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-start gap-1">
      <label htmlFor="status-os" className="sr-only">Status da ordem de serviço</label>
      <select
        id="status-os"
        value={statusAtual}
        disabled={isPending}
        onChange={(e) => {
          const novoStatus = e.target.value as StatusOrdem;
          if ((novoStatus === "FINALIZADA" || novoStatus === "CANCELADA") && !window.confirm(novoStatus === "FINALIZADA" ? "Finalizar esta ordem de serviço? Você não poderá alterar os itens depois." : "Cancelar esta ordem de serviço? Você não poderá alterar os itens depois.")) return;
          setFeedback(null);
          setIsPending(true);
          void atualizarStatus(ordemId, novoStatus).then(
            () => setFeedback("Status atualizado."),
            () => setFeedback("Não foi possível atualizar o status. Tente novamente."),
          ).finally(() => setIsPending(false));
        }}
        className="rounded-sm border border-graphite-600 bg-graphite-900 px-3 py-2 text-sm font-semibold text-paper"
      >
        {OPCOES.map((op) => <option key={op.value} value={op.value}>{op.label}</option>)}
      </select>
      {isPending && <span className="text-xs text-graphite-400" role="status">Atualizando status…</span>}
      {feedback && <span className="text-xs text-emerald-300" role="status" aria-live="polite">{feedback}</span>}
    </div>
  );
}
