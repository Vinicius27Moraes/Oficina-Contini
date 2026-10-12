import { prisma } from "@/lib/prisma";

export type MesResumo = {
  chave: string; // "2026-08"
  label: string; // "ago/26"
  ordensAbertas: number;
  ordensFinalizadas: number;
  faturamento: number;
  novosClientes: number;
  novosVeiculos: number;
  pecasUtilizadas: number;
};

const MESES_ABREV = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

function chaveDoMes(data: Date) {
  return `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}`;
}

function labelDoMes(data: Date) {
  return `${MESES_ABREV[data.getMonth()]}/${String(data.getFullYear()).slice(2)}`;
}

/**
 * Monta os últimos `meses` meses (padrão 12) com dados agregados de ordens de
 * serviço, novos clientes, novos veículos e peças utilizadas do estoque.
 * A agregação é feita em memória (não via SQL) porque o volume de dados de
 * uma oficina é pequeno o suficiente para isso ser simples e rápido.
 */
export async function getResumoMensal(meses = 12): Promise<MesResumo[]> {
  const agora = new Date();
  const cutoff = new Date(agora.getFullYear(), agora.getMonth() - (meses - 1), 1);

  const [ordens, clientes, veiculos, itens] = await Promise.all([
    prisma.ordemServico.findMany({
      where: { dataAbertura: { gte: cutoff } },
      select: { dataAbertura: true, status: true, valorTotal: true },
    }),
    prisma.cliente.findMany({
      where: { createdAt: { gte: cutoff } },
      select: { createdAt: true },
    }),
    prisma.veiculo.findMany({
      where: { createdAt: { gte: cutoff } },
      select: { createdAt: true },
    }),
    prisma.itemOrdemServico.findMany({
      where: { pecaId: { not: null }, ordem: { dataAbertura: { gte: cutoff } } },
      select: { quantidade: true, ordem: { select: { dataAbertura: true } } },
    }),
  ]);

  // monta os N meses em ordem cronológica, já zerados
  const porChave = new Map<string, MesResumo>();
  for (let i = 0; i < meses; i++) {
    const data = new Date(agora.getFullYear(), agora.getMonth() - (meses - 1) + i, 1);
    const chave = chaveDoMes(data);
    porChave.set(chave, {
      chave,
      label: labelDoMes(data),
      ordensAbertas: 0,
      ordensFinalizadas: 0,
      faturamento: 0,
      novosClientes: 0,
      novosVeiculos: 0,
      pecasUtilizadas: 0,
    });
  }

  for (const ordem of ordens) {
    const bucket = porChave.get(chaveDoMes(ordem.dataAbertura));
    if (!bucket) continue;
    if (ordem.status === "FINALIZADA") bucket.ordensFinalizadas += 1;
    else bucket.ordensAbertas += 1;
    bucket.faturamento += Number(ordem.valorTotal);
  }

  for (const cliente of clientes) {
    const bucket = porChave.get(chaveDoMes(cliente.createdAt));
    if (bucket) bucket.novosClientes += 1;
  }

  for (const veiculo of veiculos) {
    const bucket = porChave.get(chaveDoMes(veiculo.createdAt));
    if (bucket) bucket.novosVeiculos += 1;
  }

  for (const item of itens) {
    const bucket = porChave.get(chaveDoMes(item.ordem.dataAbertura));
    if (bucket) bucket.pecasUtilizadas += item.quantidade;
  }

  return Array.from(porChave.values());
}
