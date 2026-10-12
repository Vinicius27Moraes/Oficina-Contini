import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/PageHeader";
import { criarOrdem } from "@/lib/actions/ordens";
import { OrdemForm } from "./OrdemForm";

export const dynamic = "force-dynamic";

export default async function NovaOrdemPage() {
  const [clientes, funcionarios] = await Promise.all([
    prisma.cliente.findMany({ orderBy: { nome: "asc" }, include: { veiculos: true } }),
    prisma.funcionario.findMany({ where: { ativo: true }, orderBy: { nome: "asc" } }),
  ]);

  return (
    <div>
      <PageHeader eyebrow="Operação" title="Nova ordem de serviço" />
      <OrdemForm action={criarOrdem} clientes={clientes} funcionarios={funcionarios} />
    </div>
  );
}
