"use client";

import { useMemo, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "@/components/Card";
import type { MesResumo } from "@/lib/queries/dashboard";

type Metrica = "ordens" | "clientes" | "veiculos" | "estoque";

const METRICAS: { id: Metrica; label: string }[] = [
  { id: "ordens", label: "Ordens de serviço" },
  { id: "clientes", label: "Clientes novos" },
  { id: "veiculos", label: "Veículos novos" },
  { id: "estoque", label: "Peças utilizadas" },
];

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function valorDaMetrica(mes: MesResumo, metrica: Metrica) {
  switch (metrica) {
    case "ordens":
      return mes.ordensAbertas + mes.ordensFinalizadas;
    case "clientes":
      return mes.novosClientes;
    case "veiculos":
      return mes.novosVeiculos;
    case "estoque":
      return mes.pecasUtilizadas;
  }
}

export function MonthlyDashboard({ meses }: { meses: MesResumo[] }) {
  const [expandido, setExpandido] = useState(false);
  const [metrica, setMetrica] = useState<Metrica>("ordens");
  const mesAtual = meses[meses.length - 1];
  const [mesSelecionado, setMesSelecionado] = useState(mesAtual.chave);

  const dados = useMemo(
    () => meses.map((m) => ({ chave: m.chave, label: m.label, valor: valorDaMetrica(m, metrica) })),
    [meses, metrica]
  );

  const mesDetalhado = meses.find((m) => m.chave === mesSelecionado) ?? mesAtual;

  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-paper">Evolução mensal</h2>
        <button
          onClick={() => setExpandido((v) => !v)}
          className="rounded-sm border border-graphite-600 px-3 py-1.5 text-xs font-semibold text-steel-300 hover:bg-graphite-700"
        >
          {expandido ? "Recolher" : "Ver últimos 12 meses"}
        </button>
      </div>

      {/* Resumo do mês selecionado — sempre visível */}
      <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-amber-400">
        {mesDetalhado.label === mesAtual.label ? "Mês atual" : `Mês selecionado — ${mesDetalhado.label}`}
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MiniStat label="Ordens" value={mesDetalhado.ordensAbertas + mesDetalhado.ordensFinalizadas} />
        <MiniStat label="Faturamento" value={formatBRL(mesDetalhado.faturamento)} />
        <MiniStat label="Clientes novos" value={mesDetalhado.novosClientes} />
        <MiniStat label="Peças usadas" value={mesDetalhado.pecasUtilizadas} />
      </div>

      {expandido && (
        <div className="mt-5 border-t border-graphite-700 pt-4">
          <div className="mb-3 flex flex-wrap gap-2">
            {METRICAS.map((m) => (
              <button
                key={m.id}
                onClick={() => setMetrica(m.id)}
                className={`rounded-sm px-3 py-1.5 text-xs font-semibold transition ${
                  metrica === m.id
                    ? "bg-amber-500 text-graphite-950"
                    : "border border-graphite-600 text-graphite-400 hover:bg-graphite-700"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <p className="mb-2 text-xs text-graphite-500">Clique numa barra para ver o detalhamento daquele mês acima.</p>

          <div style={{ width: "100%", height: 180 }}>
            <ResponsiveContainer>
              <BarChart data={dados} onClick={(e) => e?.activeLabel && setMesSelecionado(String(e.activeLabel))}>
                <XAxis dataKey="chave" tickFormatter={(chave) => dados.find((d) => d.chave === chave)?.label ?? chave} stroke="#4C5860" fontSize={11} />
                <YAxis stroke="#4C5860" fontSize={11} allowDecimals={false} width={28} />
                <Tooltip
                  cursor={{ fill: "rgba(255,176,32,0.08)" }}
                  contentStyle={{ background: "#1B2227", border: "1px solid #37424A", borderRadius: 6, fontSize: 12 }}
                  labelFormatter={(chave) => dados.find((d) => d.chave === chave)?.label ?? chave}
                />
                <Bar
                  dataKey="valor"
                  radius={[3, 3, 0, 0]}
                  cursor="pointer"
                  fill="#FFB020"
                  fillOpacity={1}
                  shape={(props: any) => {
                    const ativo = props.payload.chave === mesSelecionado;
                    return <rect {...props} fill={ativo ? "#FFC24D" : "#854F0B"} rx={3} />;
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </Card>
  );
}

function MiniStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-sm bg-graphite-900 px-3 py-2">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-graphite-500">{label}</p>
      <p className="mt-0.5 font-display text-lg font-semibold text-paper">{value}</p>
    </div>
  );
}
