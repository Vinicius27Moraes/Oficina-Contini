"use client";

import { useFormState } from "react-dom";
import { FormField, inputClass } from "@/components/FormField";
import { SubmitButton } from "@/components/SubmitButton";
import { atualizarConfiguracao } from "@/lib/actions/configuracao";
import type { ConfiguracaoOficina } from "@prisma/client";

export function ConfiguracaoForm({ config }: { config: ConfiguracaoOficina | null }) {
  const [state, formAction] = useFormState(atualizarConfiguracao, {});

  return (
    <form action={formAction} className="flex max-w-lg flex-col gap-4">
      {state?.error && (
        <p className="rounded-sm border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-400">{state.error}</p>
      )}

      <FormField label="Nome da oficina" htmlFor="nome" error={state?.fieldErrors?.nome}>
        <input id="nome" name="nome" defaultValue={config?.nome ?? ""} className={inputClass} placeholder="Ex: Oficina do Zé" />
      </FormField>

      <FormField label="Endereço" htmlFor="endereco" error={state?.fieldErrors?.endereco}>
        <input id="endereco" name="endereco" defaultValue={config?.endereco ?? ""} className={inputClass} placeholder="Rua, número, bairro, cidade" />
      </FormField>

      <FormField label="Telefone" htmlFor="telefone" error={state?.fieldErrors?.telefone}>
        <input id="telefone" name="telefone" defaultValue={config?.telefone ?? ""} className={inputClass} placeholder="(11) 99999-0000" />
      </FormField>

      <FormField label="E-mail" htmlFor="email" error={state?.fieldErrors?.email}>
        <input id="email" name="email" type="email" defaultValue={config?.email ?? ""} className={inputClass} placeholder="opcional" />
      </FormField>

      <FormField label="Validade do orçamento (dias)" htmlFor="validadeOrcamentoDias" error={state?.fieldErrors?.validadeOrcamentoDias}>
        <input
          id="validadeOrcamentoDias"
          name="validadeOrcamentoDias"
          type="number"
          min={1}
          max={90}
          defaultValue={config?.validadeOrcamentoDias ?? 7}
          className={inputClass}
        />
      </FormField>

      <div className="mt-2">
        <SubmitButton label="Salvar configurações" pendingLabel="Salvando…" />
      </div>
    </form>
  );
}
