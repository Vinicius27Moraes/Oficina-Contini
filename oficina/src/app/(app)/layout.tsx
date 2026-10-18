import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Sidebar } from "@/components/Sidebar";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  // O middleware já bloqueia acesso não autenticado, essa checagem é uma
  // segunda camada de segurança direto no layout do servidor.
  if (!session?.user) redirect("/login");

  return (
    <div className="flex h-dvh min-h-screen flex-col overflow-hidden lg:flex-row">
      <a href="#conteudo-principal" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-sm focus:bg-amber-500 focus:px-4 focus:py-2 focus:font-semibold focus:text-graphite-950">
        Ir para o conteúdo
      </a>
      <Sidebar usuario={{ nome: session.user.name ?? "", role: session.user.role }} />
      <main id="conteudo-principal" className="min-h-0 min-w-0 flex-1 overflow-y-auto px-4 py-5 sm:px-8 sm:py-8">{children}</main>
    </div>
  );
}
