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
      .then((pecas) => pecas.filter((p) => p.quantidade <= p.quantidadeMinima).slice(0, 5)),
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

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Stat label="Ordens em aberto" value={ordensAbertas} accent />
        <Stat label="Clientes cadastrados" value={totalClientes} />
        <Stat label="Veículos cadastrados" value={totalVeiculos} />
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
                <li key={ordem.id} className="flex items-center justify-between py-3">
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
              {pecasBaixoEstoque.map((peca) => (
                <li key={peca.id} className="flex items-center justify-between text-sm">
                  <span className="text-paper">{peca.nome}</span>
                  <span className="font-mono text-amber-400">{peca.quantidade} un.</span>
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
