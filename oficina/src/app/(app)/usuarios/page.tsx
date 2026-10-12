import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/PageHeader";
import Link from "next/link";
import { RowActions } from "./RowActions";

export const dynamic = "force-dynamic";

export default async function UsuariosPage() {
  const session = await auth();
  if (session?.user.role !== "MASTER") redirect("/");

  const usuarios = await prisma.usuario.findMany({ orderBy: { nome: "asc" } });

  return (
    <div>
      <PageHeader
        eyebrow="Acesso"
        title="Usuários"
        action={
          <Link href="/usuarios/novo" className="rounded-sm bg-amber-500 px-4 py-2 text-sm font-semibold text-graphite-950 hover:bg-amber-400">
            + Novo usuário
          </Link>
        }
      />

      <p className="mb-4 text-sm text-graphite-500">
        Usuários <strong className="text-paper">Master</strong> podem gerenciar outros usuários — use esse
        papel só para quem cuida da manutenção do sistema. Os demais devem ser{" "}
        <strong className="text-paper">Padrão</strong>, para o uso diário da equipe.
      </p>

      <div className="overflow-hidden rounded-lg border border-graphite-700">
        <table className="w-full text-left text-sm">
          <thead className="bg-graphite-800 text-xs uppercase tracking-wider text-graphite-500">
            <tr>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">E-mail</th>
              <th className="px-4 py-3">Papel</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-graphite-700">
            {usuarios.map((u) => (
              <tr key={u.id} className="hover:bg-graphite-800/50">
                <td className="px-4 py-3 font-medium text-paper">{u.nome}</td>
                <td className="px-4 py-3 text-graphite-400">{u.email}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold ${u.role === "MASTER" ? "text-amber-400" : "text-steel-300"}`}>
                    {u.role === "MASTER" ? "Master" : "Padrão"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold ${u.ativo ? "text-emerald-400" : "text-graphite-500"}`}>
                    {u.ativo ? "Ativo" : "Inativo"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <RowActions id={u.id} ativo={u.ativo} role={u.role} isSelf={u.id === session.user.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
