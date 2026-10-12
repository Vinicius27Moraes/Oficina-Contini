"use client";

import { useFormState } from "react-dom";
import { FormField, inputClass } from "@/components/FormField";
import { SubmitButton } from "@/components/SubmitButton";
import { criarUsuario } from "@/lib/actions/usuarios";

export function UsuarioForm() {
  const [state, formAction] = useFormState(criarUsuario, {});

  return (
    <form action={formAction} className="flex max-w-lg flex-col gap-4">
      {state?.error && (
        <p className="rounded-sm border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-400">{state.error}</p>
      )}

      <FormField label="Nome completo" htmlFor="nome" error={state?.fieldErrors?.nome}>
        <input id="nome" name="nome" className={inputClass} placeholder="Ex: Ana Recepção" />
      </FormField>

      <FormField label="E-mail de acesso" htmlFor="email" error={state?.fieldErrors?.email}>
        <input id="email" name="email" type="email" className={inputClass} placeholder="ana@oficina.com" />
      </FormField>

      <FormField label="Senha provisória" htmlFor="senha" error={state?.fieldErrors?.senha}>
        <input id="senha" name="senha" type="password" className={inputClass} placeholder="mínimo 8 caracteres" />
      </FormField>

      <FormField label="Papel" htmlFor="role" error={state?.fieldErrors?.role}>
        <select id="role" name="role" defaultValue="PADRAO" className={inputClass}>
          <option value="PADRAO">Padrão — uso diário da equipe</option>
          <option value="MASTER">Master — gerencia outros usuários (uso restrito)</option>
        </select>
      </FormField>

      <div className="mt-2">
        <SubmitButton label="Criar usuário" pendingLabel="Criando…" />
      </div>
    </form>
  );
}
