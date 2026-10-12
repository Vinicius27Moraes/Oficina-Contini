"use client";

import { useFormState } from "react-dom";
import { FormField, inputClass } from "@/components/FormField";
import { SubmitButton } from "@/components/SubmitButton";
import type { FormState } from "@/lib/actions/utils";

export function FuncionarioForm({
  action,
}: {
  action: (prevState: FormState, formData: FormData) => Promise<FormState>;
}) {
  const [state, formAction] = useFormState(action, {});

  return (
    <form action={formAction} className="flex max-w-lg flex-col gap-4">
      {state?.error && (
        <p className="rounded-sm border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-400">{state.error}</p>
      )}
      <FormField label="Nome" htmlFor="nome" error={state?.fieldErrors?.nome}>
        <input id="nome" name="nome" className={inputClass} placeholder="Ex: João Mecânico" />
      </FormField>
      <FormField label="Cargo" htmlFor="cargo" error={state?.fieldErrors?.cargo}>
        <input id="cargo" name="cargo" className={inputClass} placeholder="Mecânico, Atendente…" />
      </FormField>
      <FormField label="Telefone" htmlFor="telefone" error={state?.fieldErrors?.telefone}>
        <input id="telefone" name="telefone" className={inputClass} placeholder="opcional" />
      </FormField>
      <div className="mt-2">
        <SubmitButton label="Cadastrar funcionário" />
      </div>
    </form>
  );
}
