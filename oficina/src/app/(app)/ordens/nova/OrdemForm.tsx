"use client";

import { useMemo, useState } from "react";
import { useFormState } from "react-dom";
import { FormField, inputClass } from "@/components/FormField";
import { SubmitButton } from "@/components/SubmitButton";
import type { Cliente, Veiculo, Funcionario } from "@prisma/client";
import type { FormState } from "@/lib/actions/utils";

type ClienteComVeiculos = Cliente & { veiculos: Veiculo[] };

export function OrdemForm({
  action,
  clientes,
  funcionarios,
}: {
  action: (prevState: FormState, formData: FormData) => Promise<FormState>;
  clientes: ClienteComVeiculos[];
  funcionarios: Funcionario[];
}) {
  const [state, formAction] = useFormState(action, {});
  const [clienteId, setClienteId] = useState("");

  const veiculosDoCliente = useMemo(
    () => clientes.find((c) => c.id === clienteId)?.veiculos ?? [],
    [clientes, clienteId]
  );

  return (
    <form action={formAction} className="flex max-w-lg flex-col gap-4">
      {state?.error && (
        <p className="rounded-sm border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-400">{state.error}</p>
      )}

      <FormField label="Cliente" htmlFor="clienteId" error={state?.fieldErrors?.clienteId}>
        <select
          id="clienteId"
          name="clienteId"
          value={clienteId}
          onChange={(e) => setClienteId(e.target.value)}
          className={inputClass}
        >
          <option value="">Selecione o cliente</option>
          {clientes.map((c) => (
            <option key={c.id} value={c.id}>{c.nome}</option>
          ))}
        </select>
      </FormField>

      <FormField label="Veículo" htmlFor="veiculoId" error={state?.fieldErrors?.veiculoId}>
        <select id="veiculoId" name="veiculoId" className={inputClass} disabled={!clienteId}>
          <option value="">{clienteId ? "Selecione o veículo" : "Selecione um cliente primeiro"}</option>
          {veiculosDoCliente.map((v) => (
            <option key={v.id} value={v.id}>{v.placa} — {v.marca} {v.modelo}</option>
          ))}
        </select>
      </FormField>

      <FormField label="Mecânico responsável" htmlFor="funcionarioId" error={state?.fieldErrors?.funcionarioId}>
        <select id="funcionarioId" name="funcionarioId" className={inputClass}>
          <option value="">Não atribuído</option>
          {funcionarios.map((f) => (
            <option key={f.id} value={f.id}>{f.nome} — {f.cargo}</option>
          ))}
        </select>
      </FormField>

      <FormField label="Problema relatado" htmlFor="descricaoProblema" error={state?.fieldErrors?.descricaoProblema}>
        <textarea id="descricaoProblema" name="descricaoProblema" rows={3} className={inputClass} placeholder="Ex: barulho ao frear, troca de óleo…" />
      </FormField>

      <FormField label="Observações" htmlFor="observacoes" error={state?.fieldErrors?.observacoes}>
        <textarea id="observacoes" name="observacoes" rows={2} className={inputClass} placeholder="opcional" />
      </FormField>

      <div className="mt-2">
        <SubmitButton label="Abrir ordem de serviço" />
      </div>
    </form>
  );
}
