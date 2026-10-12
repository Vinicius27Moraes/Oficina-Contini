import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/Card";
import { StatusBadge } from "@/components/StatusBadge";
import { PlateBadge } from "@/components/PlateBadge";
import { ItemForm } from "./ItemForm";
import { StatusControls } from "./StatusControls";
import { RemoveItemButton } from "./RemoveItemButton";
import { GerarOrcamentoPdf } from "./GerarOrcamentoPdf";

export const dynamic = "force-dynamic";

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default async function OrdemDetalhePage({ params }: { params: { id: string } }) {
  const [ordem, pecas, config] = await Promise.all([
    prisma.ordemServico.findUnique({
      where: { id: params.id },
      include: {
        cliente: true,
        veiculo: true,
        funcionario: true,
        itens: { include: { peca: true }, orderBy: { id: "asc" } },
      },
    }),
    prisma.peca.findMany({ orderBy: { nome: "asc" } }),
    prisma.configuracaoOficina.findUnique({ where: { id: "default" } }),
  ]);

  if (!ordem) notFound();

  const oficina = {
    nome: config?.nome ?? "Minha Oficina",
    endereco: config?.endereco ?? null,
    telefone: config?.telefone ?? null,
    email: config?.email ?? null,
    validadeOrcamentoDias: config?.validadeOrcamentoDias ?? 7,
  };

  // Decimal do Prisma não é serializável de Server -> Client Component,
  // então convertemos para número simples antes de passar adiante.
  const pecasParaFormulario = pecas.map((p) => ({
    id: p.id,
    codigo: p.codigo,
    nome: p.nome,
    quantidade: p.quantidade,
    precoVenda: Number(p.precoVenda),
  }));

  return (
    <div>
      <PageHeader
        eyebrow={`Ordem de serviço · aberta em ${ordem.dataAbertura.toLocaleDateString("pt-BR")}`}
        title={`OS #${ordem.numero}`}
        action={
          <div className="flex items-center gap-2">
            <GerarOrcamentoPdf
              numero={ordem.numero}
              dataAbertura={ordem.dataAbertura.toISOString()}
              cliente={{ nome: ordem.cliente.nome, telefone: ordem.cliente.telefone }}
              veiculo={{ placa: ordem.veiculo.placa, marca: ordem.veiculo.marca, modelo: ordem.veiculo.modelo, ano: ordem.veiculo.ano }}
              descricaoProblema={ordem.descricaoProblema}
              itens={ordem.itens.map((i) => ({ descricao: i.descricao, quantidade: i.quantidade, valorUnitario: Number(i.valorUnitario) }))}
              valorTotal={Number(ordem.valorTotal)}
              oficina={oficina}
            />
            <StatusControls ordemId={ordem.id} statusAtual={ordem.status} />
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <h2 className="mb-3 font-display text-lg font-semibold text-paper">Itens e serviços</h2>

            {ordem.itens.length === 0 ? (
              <p className="text-sm text-graphite-500">Nenhum item adicionado ainda.</p>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="text-xs uppercase tracking-wider text-graphite-500">
                  <tr>
                    <th className="py-2">Descrição</th>
                    <th className="py-2">Qtd.</th>
                    <th className="py-2">Valor unit.</th>
                    <th className="py-2">Subtotal</th>
                    <th className="py-2" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-graphite-700">
                  {ordem.itens.map((item) => (
                    <tr key={item.id}>
                      <td className="py-2 text-paper">
                        {item.descricao}
                        {item.peca && <span className="ml-2 font-mono text-xs text-graphite-500">({item.peca.codigo})</span>}
                      </td>
                      <td className="py-2 font-mono text-graphite-400">{item.quantidade}</td>
                      <td className="py-2 font-mono text-graphite-400">{formatBRL(Number(item.valorUnitario))}</td>
                      <td className="py-2 font-mono text-paper">{formatBRL(Number(item.valorUnitario) * item.quantidade)}</td>
                      <td className="py-2 text-right">
                        <RemoveItemButton ordemId={ordem.id} itemId={item.id} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <div className="mt-3 flex justify-end border-t border-graphite-700 pt-3">
              <p className="font-display text-xl font-semibold text-amber-400">
                Total: {formatBRL(Number(ordem.valorTotal))}
              </p>
            </div>
          </Card>

          <Card>
            <h2 className="mb-3 font-display text-lg font-semibold text-paper">Adicionar item</h2>
            <ItemForm ordemId={ordem.id} pecas={pecasParaFormulario} />
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h2 className="mb-3 font-display text-lg font-semibold text-paper">Status</h2>
            <StatusBadge status={ordem.status} />
          </Card>

          <Card>
            <h2 className="mb-3 font-display text-lg font-semibold text-paper">Cliente e veículo</h2>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-xs uppercase text-graphite-500">Cliente</dt>
                <dd className="text-paper">{ordem.cliente.nome}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase text-graphite-500">Telefone</dt>
                <dd className="text-graphite-400">{ordem.cliente.telefone}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase text-graphite-500">Veículo</dt>
                <dd className="mt-1"><PlateBadge placa={ordem.veiculo.placa} /></dd>
                <dd className="mt-1 text-graphite-400">{ordem.veiculo.marca} {ordem.veiculo.modelo} {ordem.veiculo.ano ?? ""}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase text-graphite-500">Mecânico</dt>
                <dd className="text-graphite-400">{ordem.funcionario?.nome ?? "Não atribuído"}</dd>
              </div>
            </dl>
          </Card>

          <Card>
            <h2 className="mb-2 font-display text-lg font-semibold text-paper">Problema relatado</h2>
            <p className="text-sm text-graphite-400">{ordem.descricaoProblema}</p>
            {ordem.observacoes && (
              <>
                <h3 className="mb-1 mt-3 text-xs font-semibold uppercase text-graphite-500">Observações</h3>
                <p className="text-sm text-graphite-400">{ordem.observacoes}</p>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
