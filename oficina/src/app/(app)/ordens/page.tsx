import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { StatusBadge } from "@/components/StatusBadge";
import { PlateBadge } from "@/components/PlateBadge";
import { FilterableList } from "@/components/FilterableList";
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
        <FilterableList filterLabel="Status" filters={[
          { value: "ABERTA", label: "Aberta" },
          { value: "EM_ANDAMENTO", label: "Em andamento" },
          { value: "AGUARDANDO_PECA", label: "Aguardando peça" },
          { value: "FINALIZADA", label: "Finalizada" },
          { value: "CANCELADA", label: "Cancelada" },
        ]}>
        <div className="overflow-x-auto rounded-lg border border-graphite-700">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-graphite-800 text-xs uppercase tracking-wider text-graphite-500">
              <tr>
                <th scope="col" className="px-4 py-3">OS</th>
                <th scope="col" className="px-4 py-3">Cliente</th>
                <th scope="col" className="px-4 py-3">Veículo</th>
                <th scope="col" className="px-4 py-3">Aberta em</th>
                <th scope="col" className="px-4 py-3">Total</th>
                <th scope="col" className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-graphite-700">
              {ordens.map((ordem) => (
                <tr key={ordem.id} data-list-row data-filter={ordem.status} data-search={`#${ordem.numero} ${ordem.cliente.nome} ${ordem.veiculo.placa} ${ordem.veiculo.marca} ${ordem.veiculo.modelo}`} className="hover:bg-graphite-800/50">
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
        </FilterableList>
      )}
    </div>
  );
}
