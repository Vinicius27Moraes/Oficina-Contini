"use client";

import { useFormState } from "react-dom";
import { FormField, inputClass } from "@/components/FormField";
import { SubmitButton } from "@/components/SubmitButton";
import { autenticar } from "@/lib/actions/auth";

export function LoginForm() {
  const [erro, formAction] = useFormState(autenticar, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-4 rounded-lg border border-graphite-700 bg-graphite-800 p-6">
      {erro && (
        <p className="rounded-sm border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-400">{erro}</p>
      )}

      <FormField label="E-mail" htmlFor="email">
        <input id="email" name="email" type="email" required autoFocus className={inputClass} placeholder="seu@email.com" />
      </FormField>

      <FormField label="Senha" htmlFor="senha">
        <input id="senha" name="senha" type="password" required className={inputClass} placeholder="••••••••" />
      </FormField>

      <div className="mt-2">
        <SubmitButton label="Entrar" pendingLabel="Entrando…" />
      </div>
    </form>
  );
}
