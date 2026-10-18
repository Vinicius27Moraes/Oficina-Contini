"use client";

import { useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";
import { FormField, inputClass } from "@/components/FormField";
import { SubmitButton } from "@/components/SubmitButton";
import { adicionarItem } from "@/lib/actions/ordens";

type PecaResumo = { id: string; codigo: string; nome: string; quantidade: number; precoVenda: number };

export function ItemForm({ ordemId, pecas, bloqueado = false }: { ordemId: string; pecas: PecaResumo[]; bloqueado?: boolean }) {
  const [state, formAction] = useFormState(adicionarItem, {});
  const [pecaId, setPecaId] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const descricaoRef = useRef<HTMLInputElement>(null);
  const valorRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
      setPecaId("");
    }
  }, [state]);

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
        <p role="alert" className="rounded-sm border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-400">{state.error}</p>
      )}
      {state?.success && <p role="status" aria-live="polite" className="rounded-sm border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">{state.success}</p>}

      {bloqueado && <p className="text-sm text-graphite-400">Esta ordem está encerrada; não é possível alterar os itens.</p>}

      <FormField label="Peça do estoque (opcional)" htmlFor="pecaId">
        <select id="pecaId" name="pecaId" value={pecaId} disabled={bloqueado} onChange={(e) => handlePecaChange(e.target.value)} className={inputClass}>
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
            <input ref={descricaoRef} id="descricao" name="descricao" disabled={bloqueado} required className={inputClass} placeholder="Ex: Troca de pastilha de freio" />
          </FormField>
        </div>
        <FormField label="Qtd." htmlFor="quantidade" error={state?.fieldErrors?.quantidade}>
          <input id="quantidade" name="quantidade" type="number" min={1} defaultValue={1} disabled={bloqueado} required className={inputClass} />
        </FormField>
        <div className="col-span-2">
          <FormField label="Valor unitário (R$)" htmlFor="valorUnitario" error={state?.fieldErrors?.valorUnitario}>
            <input ref={valorRef} id="valorUnitario" name="valorUnitario" type="number" min={0} step="0.01" disabled={bloqueado} required className={inputClass} placeholder="0,00" />
          </FormField>
        </div>
      </div>

      <div>
        <SubmitButton label="Adicionar item" pendingLabel="Adicionando…" disabled={bloqueado} />
      </div>
    </form>
  );
}
