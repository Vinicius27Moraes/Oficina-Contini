import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/PageHeader";
import { PecaForm } from "../../PecaForm";
import { atualizarPeca } from "@/lib/actions/pecas";

export default async function EditarPecaPage({ params }: { params: { id: string } }) {
  const peca = await prisma.peca.findUnique({ where: { id: params.id } });
  if (!peca) notFound();

  const action = atualizarPeca.bind(null, peca.id);

  // Decimal do Prisma precisa virar number puro antes de cruzar para o Client Component.
  const pecaParaFormulario = {
    ...peca,
    precoCusto: Number(peca.precoCusto),
    precoVenda: Number(peca.precoVenda),
  };

  return (
    <div>
      <PageHeader eyebrow="Estoque" title={`Editar ${peca.nome}`} />
      <PecaForm action={action} peca={pecaParaFormulario} />
    </div>
  );
}
