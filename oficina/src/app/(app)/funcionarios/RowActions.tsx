"use client";

import { DeleteButton } from "@/components/DeleteButton";
import { alternarStatusFuncionario, excluirFuncionario } from "@/lib/actions/funcionarios";

export function RowActions({ id, ativo }: { id: string; ativo: boolean }) {
  return (
    <div className="flex items-center justify-end gap-2">
      <button
        onClick={() => alternarStatusFuncionario(id, !ativo)}
        className="rounded-sm border border-graphite-600 px-3 py-1.5 text-xs font-semibold text-steel-300 hover:bg-graphite-700"
      >
        {ativo ? "Desativar" : "Ativar"}
      </button>
      <DeleteButton action={() => excluirFuncionario(id)} confirmMessage="Excluir este funcionário?" />
    </div>
  );
}
