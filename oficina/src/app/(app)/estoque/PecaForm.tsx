"use client";

import { useFormState } from "react-dom";
import { FormField, inputClass } from "@/components/FormField";
import { SubmitButton } from "@/components/SubmitButton";
import type { Peca } from "@prisma/client";
import type { FormState } from "@/lib/actions/utils";

type PecaFormValues = Omit<Peca, "precoCusto" | "precoVenda"> & {
  precoCusto: number;
  precoVenda: number;
};

export function PecaForm({
  action,
  peca,
}: {
  action: (prevState: FormState, formData: FormData) => Promise<FormState>;
  peca?: PecaFormValues;
}) {
  const [state, formAction] = useFormState(action, {});

  return (
    <form action={formAction} className="flex max-w-lg flex-col gap-4">
      {state?.error && (
        <p className="rounded-sm border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-400">{state.error}</p>
      )}

      <FormField label="Código" htmlFor="codigo" error={state?.fieldErrors?.codigo}>
        <input id="codigo" name="codigo" defaultValue={peca?.codigo} className={`${inputClass} font-mono`} placeholder="PC-0001" />
      </FormField>

      <FormField label="Nome da peça" htmlFor="nome" error={state?.fieldErrors?.nome}>
        <input id="nome" name="nome" defaultValue={peca?.nome} className={inputClass} placeholder="Filtro de óleo" />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Quantidade em estoque" htmlFor="quantidade" error={state?.fieldErrors?.quantidade}>
          <input id="quantidade" name="quantidade" type="number" defaultValue={peca?.quantidade ?? 0} className={inputClass} />
        </FormField>
        <FormField label="Estoque mínimo" htmlFor="quantidadeMinima" error={state?.fieldErrors?.quantidadeMinima}>
          <input id="quantidadeMinima" name="quantidadeMinima" type="number" defaultValue={peca?.quantidadeMinima ?? 1} className={inputClass} />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Preço de custo (R$)" htmlFor="precoCusto" error={state?.fieldErrors?.precoCusto}>
          <input id="precoCusto" name="precoCusto" type="number" step="0.01" defaultValue={peca ? Number(peca.precoCusto) : 0} className={inputClass} />
        </FormField>
        <FormField label="Preço de venda (R$)" htmlFor="precoVenda" error={state?.fieldErrors?.precoVenda}>
          <input id="precoVenda" name="precoVenda" type="number" step="0.01" defaultValue={peca ? Number(peca.precoVenda) : 0} className={inputClass} />
        </FormField>
      </div>

      <div className="mt-2">
        <SubmitButton label={peca ? "Salvar alterações" : "Cadastrar peça"} />
      </div>
    </form>
  );
}
