import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Sidebar } from "@/components/Sidebar";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  // O middleware já bloqueia acesso não autenticado, essa checagem é uma
  // segunda camada de segurança direto no layout do servidor.
  if (!session?.user) redirect("/login");

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar usuario={{ nome: session.user.name ?? "", role: session.user.role }} />
      <main className="flex-1 overflow-y-auto px-8 py-8">{children}</main>
    </div>
  );
}
