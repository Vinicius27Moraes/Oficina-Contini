import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import Link from "next/link";
import { RowActions } from "./RowActions";

export const dynamic = "force-dynamic";

export default async function FuncionariosPage() {
  const funcionarios = await prisma.funcionario.findMany({ orderBy: { nome: "asc" } });

  return (
    <div>
      <PageHeader
        eyebrow="Equipe"
        title="Funcionários"
        action={
          <Link href="/funcionarios/novo" className="rounded-sm bg-amber-500 px-4 py-2 text-sm font-semibold text-graphite-950 hover:bg-amber-400">
            + Novo funcionário
          </Link>
        }
      />

      {funcionarios.length === 0 ? (
        <EmptyState
          title="Nenhum funcionário cadastrado"
          description="Cadastre os mecânicos e atendentes da oficina para atribuir às ordens de serviço."
          actionHref="/funcionarios/novo"
          actionLabel="Cadastrar funcionário"
        />
      ) : (
        <div className="overflow-hidden rounded-lg border border-graphite-700">
          <table className="w-full text-left text-sm">
            <thead className="bg-graphite-800 text-xs uppercase tracking-wider text-graphite-500">
              <tr>
                <th className="px-4 py-3">Nome</th>
                <th className="px-4 py-3">Cargo</th>
                <th className="px-4 py-3">Telefone</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-graphite-700">
              {funcionarios.map((f) => (
                <tr key={f.id} className="hover:bg-graphite-800/50">
                  <td className="px-4 py-3 font-medium text-paper">{f.nome}</td>
                  <td className="px-4 py-3 text-graphite-400">{f.cargo}</td>
                  <td className="px-4 py-3 text-graphite-400">{f.telefone ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold ${f.ativo ? "text-emerald-400" : "text-graphite-500"}`}>
                      {f.ativo ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                  <td className="px-4 py-3"><RowActions id={f.id} ativo={f.ativo} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
