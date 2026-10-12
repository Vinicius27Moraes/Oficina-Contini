"use client";

import Link from "next/link";
import { DeleteButton } from "@/components/DeleteButton";
import { excluirCliente } from "@/lib/actions/clientes";

export function RowActions({ id }: { id: string }) {
  return (
    <div className="flex items-center justify-end gap-2">
      <Link
        href={`/clientes/${id}/editar`}
        className="rounded-sm border border-graphite-600 px-3 py-1.5 text-xs font-semibold text-steel-300 hover:bg-graphite-700"
      >
        Editar
      </Link>
      <DeleteButton
        action={() => excluirCliente(id)}
        confirmMessage="Excluir este cliente? Os veículos vinculados também serão removidos."
      />
    </div>
  );
}
