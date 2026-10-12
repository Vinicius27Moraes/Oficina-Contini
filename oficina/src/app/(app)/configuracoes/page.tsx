import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/PageHeader";
import { ConfiguracaoForm } from "./ConfiguracaoForm";

export const dynamic = "force-dynamic";

export default async function ConfiguracoesPage() {
  const session = await auth();
  if (session?.user.role !== "MASTER") redirect("/");

  const config = await prisma.configuracaoOficina.findUnique({ where: { id: "default" } });

  return (
    <div>
      <PageHeader eyebrow="Sistema" title="Configurações da oficina" />
      <p className="mb-4 max-w-lg text-sm text-graphite-500">
        Esses dados aparecem no cabeçalho dos orçamentos em PDF gerados nas ordens de serviço.
      </p>
      <ConfiguracaoForm config={config} />
    </div>
  );
}
