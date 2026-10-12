"use client";

import { useRef, useState } from "react";
import { useFormState } from "react-dom";
import { FormField, inputClass } from "@/components/FormField";
import { SubmitButton } from "@/components/SubmitButton";
import { adicionarItem } from "@/lib/actions/ordens";

type PecaResumo = { id: string; codigo: string; nome: string; quantidade: number; precoVenda: number };

export function ItemForm({ ordemId, pecas }: { ordemId: string; pecas: PecaResumo[] }) {
  const [state, formAction] = useFormState(adicionarItem, {});
  const [pecaId, setPecaId] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const descricaoRef = useRef<HTMLInputElement>(null);
  const valorRef = useRef<HTMLInputElement>(null);

  function handlePecaChange(id: string) {
    setPecaId(id);
    const peca = pecas.find((p) => p.id === id);
    if (peca && descricaoRef.current && valorRef.current) {
      descricaoRef.current.value = peca.nome;
      valorRef.current.value = String(peca.precoVenda);
    }
  }

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="ordemId" value={ordemId} />

      {state?.error && (
        <p className="rounded-sm border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-400">{state.error}</p>
      )}

      <FormField label="Peça do estoque (opcional)" htmlFor="pecaId">
        <select id="pecaId" name="pecaId" value={pecaId} onChange={(e) => handlePecaChange(e.target.value)} className={inputClass}>
          <option value="">Item avulso / mão de obra</option>
          {pecas.map((p) => (
            <option key={p.id} value={p.id} disabled={p.quantidade <= 0}>
              {p.nome} ({p.quantidade} em estoque)
            </option>
          ))}
        </select>
      </FormField>

      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-3">
          <FormField label="Descrição" htmlFor="descricao" error={state?.fieldErrors?.descricao}>
            <input ref={descricaoRef} id="descricao" name="descricao" className={inputClass} placeholder="Ex: Troca de pastilha de freio" />
          </FormField>
        </div>
        <FormField label="Qtd." htmlFor="quantidade" error={state?.fieldErrors?.quantidade}>
          <input id="quantidade" name="quantidade" type="number" min={1} defaultValue={1} className={inputClass} />
        </FormField>
        <div className="col-span-2">
          <FormField label="Valor unitário (R$)" htmlFor="valorUnitario" error={state?.fieldErrors?.valorUnitario}>
            <input ref={valorRef} id="valorUnitario" name="valorUnitario" type="number" step="0.01" className={inputClass} />
          </FormField>
        </div>
      </div>

      <div>
        <SubmitButton label="Adicionar item" pendingLabel="Adicionando…" />
      </div>
    </form>
  );
}
