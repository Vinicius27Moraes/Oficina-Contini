import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/PageHeader";
import { ClienteForm } from "../../ClienteForm";
import { atualizarCliente } from "@/lib/actions/clientes";

export default async function EditarClientePage({ params }: { params: { id: string } }) {
  const cliente = await prisma.cliente.findUnique({ where: { id: params.id } });
  if (!cliente) notFound();

  const action = atualizarCliente.bind(null, cliente.id);

  return (
    <div>
      <PageHeader eyebrow="Cadastro" title={`Editar ${cliente.nome}`} />
      <ClienteForm action={action} cliente={cliente} />
    </div>
  );
}
