import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import Link from "next/link";
import { RowActions } from "./RowActions";
import { FilterableList } from "@/components/FilterableList";
import { ActionNotice } from "@/components/ActionNotice";

export const dynamic = "force-dynamic";

export default async function ClientesPage({ searchParams }: { searchParams?: { salvo?: string } }) {
  const clientes = await prisma.cliente.findMany({
    orderBy: { nome: "asc" },
    include: { _count: { select: { veiculos: true } } },
  });

  return (
    <div>
      <PageHeader
        eyebrow="Cadastro"
        title="Clientes"
        action={
          <Link href="/clientes/novo" className="rounded-sm bg-amber-500 px-4 py-2 text-sm font-semibold text-graphite-950 hover:bg-amber-400">
            + Novo cliente
          </Link>
        }
      />

      {searchParams?.salvo === "1" && <ActionNotice />}

      {clientes.length === 0 ? (
        <EmptyState
          title="Nenhum cliente cadastrado"
          description="Cadastre o primeiro cliente da oficina para começar a criar ordens de serviço."
          actionHref="/clientes/novo"
          actionLabel="Cadastrar cliente"
        />
      ) : (
        <FilterableList>
        <div className="overflow-x-auto rounded-lg border border-graphite-700">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-graphite-800 text-xs uppercase tracking-wider text-graphite-500">
              <tr>
                <th scope="col" className="px-4 py-3">Nome</th>
                <th scope="col" className="px-4 py-3">Telefone</th>
                <th scope="col" className="px-4 py-3">E-mail</th>
                <th scope="col" className="px-4 py-3">Veículos</th>
                <th scope="col" className="px-4 py-3"><span className="sr-only">Ações</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-graphite-700">
              {clientes.map((cliente) => (
                <tr key={cliente.id} data-list-row data-search={`${cliente.nome} ${cliente.telefone} ${cliente.email ?? ""} ${cliente.cpfCnpj ?? ""}`} className="hover:bg-graphite-800/50">
                  <td className="px-4 py-3 font-medium text-paper">{cliente.nome}</td>
                  <td className="px-4 py-3 text-graphite-400">{cliente.telefone}</td>
                  <td className="px-4 py-3 text-graphite-400">{cliente.email ?? "—"}</td>
                  <td className="px-4 py-3 text-graphite-400">{cliente._count.veiculos}</td>
                  <td className="px-4 py-3">
                    <RowActions id={cliente.id} />
                  </td>
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
