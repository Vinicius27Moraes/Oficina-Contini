import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/PageHeader";
import { VeiculoForm } from "../../VeiculoForm";
import { atualizarVeiculo } from "@/lib/actions/veiculos";

export default async function EditarVeiculoPage({ params }: { params: { id: string } }) {
  const [veiculo, clientes] = await Promise.all([
    prisma.veiculo.findUnique({ where: { id: params.id } }),
    prisma.cliente.findMany({ orderBy: { nome: "asc" } }),
  ]);
  if (!veiculo) notFound();

  const action = atualizarVeiculo.bind(null, veiculo.id);

  return (
    <div>
      <PageHeader eyebrow="Cadastro" title={`Editar ${veiculo.placa}`} />
      <VeiculoForm action={action} veiculo={veiculo} clientes={clientes} />
    </div>
  );
}
