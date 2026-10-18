"use client";

import { DeleteButton } from "@/components/DeleteButton";
import { ActionButton } from "@/components/ActionButton";
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

  async function handleRedefinirSenha() {
    const novaSenha = window.prompt("Digite a nova senha para esse usuário (mínimo 8 caracteres):");
    if (!novaSenha) return;
    if (novaSenha.length < 8) throw new Error("A senha deve ter pelo menos 8 caracteres.");
    await redefinirSenha(id, novaSenha);
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <ActionButton action={handleRedefinirSenha}>Redefinir senha</ActionButton>
      <ActionButton
        action={() => alternarStatusUsuario(id, !ativo)}
        confirmMessage={ativo ? "Desativar este usuário? Ele perderá o acesso ao sistema." : undefined}
      >{ativo ? "Desativar" : "Ativar"}</ActionButton>
      {role !== "MASTER" && (
        <DeleteButton action={() => excluirUsuario(id)} confirmMessage="Excluir este usuário? Ele perderá o acesso imediatamente." />
      )}
    </div>
  );
}
