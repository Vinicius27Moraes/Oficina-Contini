"use client";

import { useFormState } from "react-dom";
import { FormField, inputClass } from "@/components/FormField";
import { SubmitButton } from "@/components/SubmitButton";
import type { Cliente } from "@prisma/client";
import type { FormState } from "@/lib/actions/utils";

export function ClienteForm({
  action,
  cliente,
}: {
  action: (prevState: FormState, formData: FormData) => Promise<FormState>;
  cliente?: Cliente;
}) {
  const [state, formAction] = useFormState(action, {});

  return (
    <form action={formAction} className="flex max-w-lg flex-col gap-4">
      {state?.error && (
        <p className="rounded-sm border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-400">{state.error}</p>
      )}

      <FormField label="Nome completo" htmlFor="nome" error={state?.fieldErrors?.nome}>
        <input id="nome" name="nome" defaultValue={cliente?.nome} className={inputClass} placeholder="Ex: Maria Oliveira" />
      </FormField>

      <FormField label="Telefone" htmlFor="telefone" error={state?.fieldErrors?.telefone}>
        <input id="telefone" name="telefone" defaultValue={cliente?.telefone} className={inputClass} placeholder="(11) 99999-0000" />
      </FormField>

      <FormField label="E-mail" htmlFor="email" error={state?.fieldErrors?.email}>
        <input id="email" name="email" type="email" defaultValue={cliente?.email ?? ""} className={inputClass} placeholder="opcional" />
      </FormField>

      <FormField label="CPF ou CNPJ" htmlFor="cpfCnpj" error={state?.fieldErrors?.cpfCnpj}>
        <input id="cpfCnpj" name="cpfCnpj" defaultValue={cliente?.cpfCnpj ?? ""} className={inputClass} placeholder="opcional" />
      </FormField>

      <FormField label="Endereço" htmlFor="endereco" error={state?.fieldErrors?.endereco}>
        <input id="endereco" name="endereco" defaultValue={cliente?.endereco ?? ""} className={inputClass} placeholder="opcional" />
      </FormField>

      <div className="mt-2">
        <SubmitButton label={cliente ? "Salvar alterações" : "Cadastrar cliente"} />
      </div>
    </form>
  );
}
