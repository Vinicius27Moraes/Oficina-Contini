"use client";

import { DeleteButton } from "@/components/DeleteButton";
import { ActionButton } from "@/components/ActionButton";
import { alternarStatusFuncionario, excluirFuncionario } from "@/lib/actions/funcionarios";

export function RowActions({ id, ativo }: { id: string; ativo: boolean }) {
  return (
    <div className="flex items-center justify-end gap-2">
      <ActionButton action={() => alternarStatusFuncionario(id, !ativo)}>{ativo ? "Desativar" : "Ativar"}</ActionButton>
      <DeleteButton action={() => excluirFuncionario(id)} confirmMessage="Excluir este funcionário?" />
    </div>
  );
}
