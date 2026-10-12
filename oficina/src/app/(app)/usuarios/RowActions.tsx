"use client";

import { DeleteButton } from "@/components/DeleteButton";
import { alternarStatusUsuario, excluirUsuario, redefinirSenha } from "@/lib/actions/usuarios";

export function RowActions({
  id,
  ativo,
  role,
  isSelf,
}: {
  id: string;
  ativo: boolean;
  role: "MASTER" | "PADRAO";
  isSelf: boolean;
}) {
  if (isSelf) {
    return <span className="text-xs text-graphite-500">seu usuário</span>;
  }

  function handleRedefinirSenha() {
    const novaSenha = window.prompt("Digite a nova senha para esse usuário (mínimo 8 caracteres):");
    if (novaSenha) redefinirSenha(id, novaSenha);
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <button
        onClick={handleRedefinirSenha}
        className="rounded-sm border border-graphite-600 px-3 py-1.5 text-xs font-semibold text-steel-300 hover:bg-graphite-700"
      >
        Redefinir senha
      </button>
      <button
        onClick={() => alternarStatusUsuario(id, !ativo)}
        className="rounded-sm border border-graphite-600 px-3 py-1.5 text-xs font-semibold text-steel-300 hover:bg-graphite-700"
      >
        {ativo ? "Desativar" : "Ativar"}
      </button>
      {role !== "MASTER" && (
        <DeleteButton action={() => excluirUsuario(id)} confirmMessage="Excluir este usuário? Ele perderá o acesso imediatamente." />
      )}
    </div>
  );
}
