import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import Link from "next/link";
import { RowActions } from "./RowActions";

export const dynamic = "force-dynamic";

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default async function EstoquePage() {
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

      {pecas.length === 0 ? (
        <EmptyState
          title="Nenhuma peça cadastrada"
          description="Cadastre as peças que a oficina usa ou revende para controlar o estoque."
          actionHref="/estoque/novo"
          actionLabel="Cadastrar peça"
        />
      ) : (
        <div className="overflow-hidden rounded-lg border border-graphite-700">
          <table className="w-full text-left text-sm">
            <thead className="bg-graphite-800 text-xs uppercase tracking-wider text-graphite-500">
              <tr>
                <th className="px-4 py-3">Código</th>
                <th className="px-4 py-3">Peça</th>
                <th className="px-4 py-3">Qtd.</th>
                <th className="px-4 py-3">Preço venda</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-graphite-700">
              {pecas.map((peca) => {
                const baixo = peca.quantidade <= peca.quantidadeMinima;
                return (
                  <tr key={peca.id} className="hover:bg-graphite-800/50">
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
      )}
    </div>
  );
}
