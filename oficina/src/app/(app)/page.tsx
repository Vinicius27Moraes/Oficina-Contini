import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/Card";
import { StatusBadge } from "@/components/StatusBadge";
import { PlateBadge } from "@/components/PlateBadge";
import Link from "next/link";
import { getResumoMensal } from "@/lib/queries/dashboard";
import { MonthlyDashboard } from "./MonthlyDashboard";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [ordensAbertas, totalClientes, totalVeiculos, pecasBaixoEstoque, ultimasOrdens, resumoMensal] = await Promise.all([
    prisma.ordemServico.count({ where: { status: { in: ["ABERTA", "EM_ANDAMENTO", "AGUARDANDO_PECA"] } } }),
    prisma.cliente.count(),
    prisma.veiculo.count(),
    prisma.peca
      .findMany({ orderBy: { quantidade: "asc" } })
      .then((pecas) => pecas.filter((p) => p.quantidade <= p.quantidadeMinima)),
    prisma.ordemServico.findMany({
      take: 6,
      orderBy: { dataAbertura: "desc" },
      include: { cliente: true, veiculo: true },
    }),
    getResumoMensal(12),
  ]);

  return (
    <div>
      <PageHeader eyebrow="Visão geral" title="Painel da oficina" />

      <div className="mb-6 flex flex-wrap gap-3" aria-label="Atalhos operacionais">
        <Link href="/ordens/nova" className="rounded-sm bg-amber-500 px-4 py-2 text-sm font-semibold text-graphite-950 transition hover:bg-amber-400">+ Abrir ordem de serviço</Link>
        <Link href="/clientes/novo" className="rounded-sm border border-graphite-600 px-4 py-2 text-sm font-semibold text-steel-300 transition hover:bg-graphite-800 hover:text-paper">+ Cadastrar cliente</Link>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Ordens em aberto" value={ordensAbertas} accent />
        <Stat label="Clientes cadastrados" value={totalClientes} />
        <Stat label="Veículos cadastrados" value={totalVeiculos} />
        <Stat label="Peças no mínimo ou abaixo" value={pecasBaixoEstoque.length} />
      </div>

      <div className="mb-6">
        <MonthlyDashboard meses={resumoMensal} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-paper">Últimas ordens de serviço</h2>
            <Link href="/ordens" className="text-xs font-semibold text-amber-400 hover:underline">
              ver todas
            </Link>
          </div>
          {ultimasOrdens.length === 0 ? (
            <p className="text-sm text-graphite-500">Nenhuma ordem de serviço criada ainda.</p>
          ) : (
            <ul className="divide-y divide-graphite-700">
              {ultimasOrdens.map((ordem) => (
                <li key={ordem.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                  <div>
                    <Link href={`/ordens/${ordem.id}`} className="text-sm font-semibold text-paper hover:text-amber-400">
                      OS #{ordem.numero} — {ordem.cliente.nome}
                    </Link>
                    <div className="mt-1 flex items-center gap-2">
                      <PlateBadge placa={ordem.veiculo.placa} />
                      <span className="text-xs text-graphite-500">{ordem.veiculo.marca} {ordem.veiculo.modelo}</span>
                    </div>
                  </div>
                  <StatusBadge status={ordem.status} />
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <h2 className="mb-4 font-display text-lg font-semibold text-paper">Estoque baixo</h2>
          {pecasBaixoEstoque.length === 0 ? (
            <p className="text-sm text-graphite-500">Nenhuma peça abaixo do mínimo.</p>
          ) : (
            <ul className="space-y-3">
              {pecasBaixoEstoque.slice(0, 5).map((peca) => (
                <li key={peca.id} className="flex items-center justify-between gap-3 text-sm">
                  <Link href={`/estoque/${peca.id}/editar`} className="min-w-0 truncate text-paper hover:text-amber-400 hover:underline">
                    {peca.nome}
                  </Link>
                  <span className="shrink-0 font-mono text-amber-400" aria-label={`${peca.quantidade} unidades; mínimo ${peca.quantidadeMinima}`}>
                    {peca.quantidade} / mín. {peca.quantidadeMinima}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <Link href="/estoque" className="mt-4 inline-block text-xs font-semibold text-amber-400 hover:underline">
            gerenciar estoque
          </Link>
        </Card>
      </div>
    </div>
  );
}

function Stat({ label, value, accent = false }: { label: string; value: number; accent?: boolean }) {
  return (
    <Card className={accent ? "border-amber-500/40" : ""}>
      <p className="text-xs font-semibold uppercase tracking-widest text-graphite-500">{label}</p>
      <p className={`mt-1 font-display text-4xl font-semibold ${accent ? "text-amber-400" : "text-paper"}`}>{value}</p>
    </Card>
  );
}
