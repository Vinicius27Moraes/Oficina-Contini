import { PageHeader } from "@/components/PageHeader";
import { FuncionarioForm } from "../FuncionarioForm";
import { criarFuncionario } from "@/lib/actions/funcionarios";

export default function NovoFuncionarioPage() {
  return (
    <div>
      <PageHeader eyebrow="Equipe" title="Novo funcionário" />
      <FuncionarioForm action={criarFuncionario} />
    </div>
  );
}
