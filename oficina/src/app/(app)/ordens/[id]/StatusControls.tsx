"use client";

import { useTransition } from "react";
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
  const [isPending, startTransition] = useTransition();

  return (
    <select
      value={statusAtual}
      disabled={isPending}
      onChange={(e) => startTransition(() => atualizarStatus(ordemId, e.target.value as StatusOrdem))}
      className="rounded-sm border border-graphite-600 bg-graphite-900 px-3 py-2 text-sm font-semibold text-paper focus:border-amber-500 focus:outline-none"
    >
      {OPCOES.map((op) => (
        <option key={op.value} value={op.value}>{op.label}</option>
      ))}
    </select>
  );
}
