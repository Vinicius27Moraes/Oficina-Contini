"use client";

import { DeleteButton } from "@/components/DeleteButton";
import { removerItem } from "@/lib/actions/ordens";

export function RemoveItemButton({ ordemId, itemId, disabled = false }: { ordemId: string; itemId: string; disabled?: boolean }) {
  return (
    <DeleteButton disabled={disabled} action={() => removerItem(ordemId, itemId)} confirmMessage="Remover este item da ordem? A quantidade correspondente voltará ao estoque.">
      remover
    </DeleteButton>
  );
}
