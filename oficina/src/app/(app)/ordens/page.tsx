import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { StatusBadge } from "@/components/StatusBadge";
import { PlateBadge } from "@/components/PlateBadge";
import Link from "next/link";

export const dynamic = "force-dynamic";

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default async function OrdensPage() {
  const ordens = await prisma.ordemServico.findMany({
    orderBy: { dataAbertura: "desc" },
    include: { cliente: true, veiculo: true },
  });

  return (
    <div>
      <PageHeader
        eyebrow="Operação"
        title="Ordens de serviço"
        action={
          <Link href="/ordens/nova" className="rounded-sm bg-amber-500 px-4 py-2 text-sm font-semibold text-graphite-950 hover:bg-amber-400">
            + Nova ordem
          </Link>
        }
      />

      {ordens.length === 0 ? (
        <EmptyState
          title="Nenhuma ordem de serviço"
          description="Abra a primeira ordem de serviço vinculando um cliente e um veículo."
          actionHref="/ordens/nova"
          actionLabel="Abrir ordem de serviço"
        />
      ) : (
        <div className="overflow-hidden rounded-lg border border-graphite-700">
          <table className="w-full text-left text-sm">
            <thead className="bg-graphite-800 text-xs uppercase tracking-wider text-graphite-500">
              <tr>
                <th className="px-4 py-3">OS</th>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Veículo</th>
                <th className="px-4 py-3">Aberta em</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-graphite-700">
              {ordens.map((ordem) => (
                <tr key={ordem.id} className="cursor-pointer hover:bg-graphite-800/50">
                  <td className="px-4 py-3">
                    <Link href={`/ordens/${ordem.id}`} className="font-mono font-semibold text-amber-400 hover:underline">
                      #{ordem.numero}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-paper">{ordem.cliente.nome}</td>
                  <td className="px-4 py-3"><PlateBadge placa={ordem.veiculo.placa} /></td>
                  <td className="px-4 py-3 text-graphite-400">{ordem.dataAbertura.toLocaleDateString("pt-BR")}</td>
                  <td className="px-4 py-3 font-mono text-graphite-400">{formatBRL(Number(ordem.valorTotal))}</td>
                  <td className="px-4 py-3"><StatusBadge status={ordem.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
