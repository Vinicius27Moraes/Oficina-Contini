import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { PageHeader } from "@/components/PageHeader";
import { UsuarioForm } from "../UsuarioForm";

export const dynamic = "force-dynamic";

export default async function NovoUsuarioPage() {
  const session = await auth();
  if (session?.user.role !== "MASTER") redirect("/");

  return (
    <div>
      <PageHeader eyebrow="Acesso" title="Novo usuário" />
      <UsuarioForm />
    </div>
  );
}
