import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import Link from "next/link";
import { RowActions } from "./RowActions";

export const dynamic = "force-dynamic";

export default async function ClientesPage() {
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

      {clientes.length === 0 ? (
        <EmptyState
          title="Nenhum cliente cadastrado"
          description="Cadastre o primeiro cliente da oficina para começar a criar ordens de serviço."
          actionHref="/clientes/novo"
          actionLabel="Cadastrar cliente"
        />
      ) : (
        <div className="overflow-hidden rounded-lg border border-graphite-700">
          <table className="w-full text-left text-sm">
            <thead className="bg-graphite-800 text-xs uppercase tracking-wider text-graphite-500">
              <tr>
                <th className="px-4 py-3">Nome</th>
                <th className="px-4 py-3">Telefone</th>
                <th className="px-4 py-3">E-mail</th>
                <th className="px-4 py-3">Veículos</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-graphite-700">
              {clientes.map((cliente) => (
                <tr key={cliente.id} className="hover:bg-graphite-800/50">
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
      )}
    </div>
  );
}
