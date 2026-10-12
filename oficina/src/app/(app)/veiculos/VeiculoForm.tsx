"use client";

import { useFormState } from "react-dom";
import { FormField, inputClass } from "@/components/FormField";
import { SubmitButton } from "@/components/SubmitButton";
import type { Veiculo, Cliente } from "@prisma/client";
import type { FormState } from "@/lib/actions/utils";

export function VeiculoForm({
  action,
  veiculo,
  clientes,
}: {
  action: (prevState: FormState, formData: FormData) => Promise<FormState>;
  veiculo?: Veiculo;
  clientes: Cliente[];
}) {
  const [state, formAction] = useFormState(action, {});

  return (
    <form action={formAction} className="flex max-w-lg flex-col gap-4">
      {state?.error && (
        <p className="rounded-sm border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-400">{state.error}</p>
      )}

      <FormField label="Cliente" htmlFor="clienteId" error={state?.fieldErrors?.clienteId}>
        <select id="clienteId" name="clienteId" defaultValue={veiculo?.clienteId} className={inputClass}>
          <option value="">Selecione o cliente</option>
          {clientes.map((c) => (
            <option key={c.id} value={c.id}>{c.nome}</option>
          ))}
        </select>
      </FormField>

      <FormField label="Placa" htmlFor="placa" error={state?.fieldErrors?.placa}>
        <input id="placa" name="placa" defaultValue={veiculo?.placa} className={`${inputClass} font-mono uppercase`} placeholder="ABC1D23" maxLength={8} />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Marca" htmlFor="marca" error={state?.fieldErrors?.marca}>
          <input id="marca" name="marca" defaultValue={veiculo?.marca} className={inputClass} placeholder="Volkswagen" />
        </FormField>
        <FormField label="Modelo" htmlFor="modelo" error={state?.fieldErrors?.modelo}>
          <input id="modelo" name="modelo" defaultValue={veiculo?.modelo} className={inputClass} placeholder="Gol" />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Ano" htmlFor="ano" error={state?.fieldErrors?.ano}>
          <input id="ano" name="ano" type="number" defaultValue={veiculo?.ano ?? ""} className={inputClass} placeholder="2020" />
        </FormField>
        <FormField label="Cor" htmlFor="cor" error={state?.fieldErrors?.cor}>
          <input id="cor" name="cor" defaultValue={veiculo?.cor ?? ""} className={inputClass} placeholder="Prata" />
        </FormField>
      </div>

      <div className="mt-2">
        <SubmitButton label={veiculo ? "Salvar alterações" : "Cadastrar veículo"} />
      </div>
    </form>
  );
}
