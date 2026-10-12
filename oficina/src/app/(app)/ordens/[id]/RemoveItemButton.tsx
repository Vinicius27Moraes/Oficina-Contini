"use client";

import { DeleteButton } from "@/components/DeleteButton";
import { removerItem } from "@/lib/actions/ordens";

export function RemoveItemButton({ ordemId, itemId }: { ordemId: string; itemId: string }) {
  return (
    <DeleteButton action={() => removerItem(ordemId, itemId)} confirmMessage="Remover este item da ordem?">
      remover
    </DeleteButton>
  );
}
