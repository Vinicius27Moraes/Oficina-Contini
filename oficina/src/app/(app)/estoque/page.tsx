import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import Link from "next/link";
import { RowActions } from "./RowActions";
import { FilterableList } from "@/components/FilterableList";
import { ActionNotice } from "@/components/ActionNotice";

export const dynamic = "force-dynamic";

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default async function EstoquePage({ searchParams }: { searchParams?: { salvo?: string } }) {
  const pecas = await prisma.peca.findMany({ orderBy: { nome: "asc" } });

  return (
    <div>
      <PageHeader
        eyebrow="Estoque"
        title="Peças"
        action={
          <Link href="/estoque/novo" className="rounded-sm bg-amber-500 px-4 py-2 text-sm font-semibold text-graphite-950 hover:bg-amber-400">
            + Nova peça
          </Link>
        }
      />

      {searchParams?.salvo === "1" && <ActionNotice />}

      {pecas.length === 0 ? (
        <EmptyState
          title="Nenhuma peça cadastrada"
          description="Cadastre as peças que a oficina usa ou revende para controlar o estoque."
          actionHref="/estoque/novo"
          actionLabel="Cadastrar peça"
        />
      ) : (
        <FilterableList filterLabel="Disponibilidade" filters={[
          { value: "baixo", label: "Estoque baixo" },
          { value: "ok", label: "Estoque normal" },
        ]}>
        <div className="overflow-x-auto rounded-lg border border-graphite-700">
          <table className="w-full min-w-[620px] text-left text-sm">
            <thead className="bg-graphite-800 text-xs uppercase tracking-wider text-graphite-500">
              <tr>
                <th scope="col" className="px-4 py-3">Código</th>
                <th scope="col" className="px-4 py-3">Peça</th>
                <th scope="col" className="px-4 py-3">Qtd.</th>
                <th scope="col" className="px-4 py-3">Preço venda</th>
                <th scope="col" className="px-4 py-3"><span className="sr-only">Ações</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-graphite-700">
              {pecas.map((peca) => {
                const baixo = peca.quantidade <= peca.quantidadeMinima;
                return (
                  <tr key={peca.id} data-list-row data-filter={baixo ? "baixo" : "ok"} data-search={`${peca.codigo} ${peca.nome}`} className="hover:bg-graphite-800/50">
                    <td className="px-4 py-3 font-mono text-graphite-400">{peca.codigo}</td>
                    <td className="px-4 py-3 text-paper">{peca.nome}</td>
                    <td className={`px-4 py-3 font-mono ${baixo ? "font-semibold text-amber-400" : "text-graphite-400"}`}>
                      {peca.quantidade} {baixo && "⚠"}
                    </td>
                    <td className="px-4 py-3 text-graphite-400">{formatBRL(Number(peca.precoVenda))}</td>
                    <td className="px-4 py-3"><RowActions id={peca.id} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        </FilterableList>
      )}
    </div>
  );
}
