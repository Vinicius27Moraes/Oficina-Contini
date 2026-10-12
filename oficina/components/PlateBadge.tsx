// Elemento de assinatura visual: badge no estilo placa de veículo (Mercosul),
// usado para exibir placas em tabelas e cabeçalhos — reforça a identidade
// "oficina" do produto em vez de um badge genérico.
export function PlateBadge({ placa }: { placa: string }) {
  return (
    <span className="inline-flex items-center rounded-sm border-2 border-graphite-900 bg-paper px-2 py-0.5 font-mono text-xs font-bold tracking-wider text-graphite-900 shadow-[2px_2px_0_0_theme(colors.graphite.900)]">
      {placa}
    </span>
  );
}
