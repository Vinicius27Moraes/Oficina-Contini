"use client";

import Link from "next/link";
import { DeleteButton } from "@/components/DeleteButton";
import { excluirVeiculo } from "@/lib/actions/veiculos";

export function RowActions({ id }: { id: string }) {
  return (
    <div className="flex items-center justify-end gap-2">
      <Link href={`/veiculos/${id}/editar`} className="rounded-sm border border-graphite-600 px-3 py-1.5 text-xs font-semibold text-steel-300 hover:bg-graphite-700">
        Editar
      </Link>
      <DeleteButton action={() => excluirVeiculo(id)} confirmMessage="Excluir este veículo?" />
    </div>
  );
}
