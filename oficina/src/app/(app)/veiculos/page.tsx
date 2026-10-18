import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { PlateBadge } from "@/components/PlateBadge";
import Link from "next/link";
import { RowActions } from "./RowActions";
import { FilterableList } from "@/components/FilterableList";
import { ActionNotice } from "@/components/ActionNotice";

export const dynamic = "force-dynamic";

export default async function VeiculosPage({ searchParams }: { searchParams?: { salvo?: string } }) {
  const veiculos = await prisma.veiculo.findMany({
    orderBy: { createdAt: "desc" },
    include: { cliente: true },
  });

  return (
    <div>
      <PageHeader
        eyebrow="Cadastro"
        title="Veículos"
        action={
          <Link href="/veiculos/novo" className="rounded-sm bg-amber-500 px-4 py-2 text-sm font-semibold text-graphite-950 hover:bg-amber-400">
            + Novo veículo
          </Link>
        }
      />

      {searchParams?.salvo === "1" && <ActionNotice />}

      {veiculos.length === 0 ? (
        <EmptyState
          title="Nenhum veículo cadastrado"
          description="Cadastre o veículo de um cliente para começar a abrir ordens de serviço."
          actionHref="/veiculos/novo"
          actionLabel="Cadastrar veículo"
        />
      ) : (
        <FilterableList>
        <div className="overflow-x-auto rounded-lg border border-graphite-700">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="bg-graphite-800 text-xs uppercase tracking-wider text-graphite-500">
              <tr>
                <th scope="col" className="px-4 py-3">Placa</th>
                <th scope="col" className="px-4 py-3">Veículo</th>
                <th scope="col" className="px-4 py-3">Cliente</th>
                <th scope="col" className="px-4 py-3"><span className="sr-only">Ações</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-graphite-700">
              {veiculos.map((veiculo) => (
                <tr key={veiculo.id} data-list-row data-search={`${veiculo.placa} ${veiculo.marca} ${veiculo.modelo} ${veiculo.cliente.nome}`} className="hover:bg-graphite-800/50">
                  <td className="px-4 py-3"><PlateBadge placa={veiculo.placa} /></td>
                  <td className="px-4 py-3 text-paper">{veiculo.marca} {veiculo.modelo} {veiculo.ano ? `· ${veiculo.ano}` : ""}</td>
                  <td className="px-4 py-3 text-graphite-400">{veiculo.cliente.nome}</td>
                  <td className="px-4 py-3"><RowActions id={veiculo.id} /></td>
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
