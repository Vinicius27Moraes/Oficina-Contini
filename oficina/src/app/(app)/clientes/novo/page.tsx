import { PageHeader } from "@/components/PageHeader";
import { ClienteForm } from "../ClienteForm";
import { criarCliente } from "@/lib/actions/clientes";

export default function NovoClientePage() {
  return (
    <div>
      <PageHeader eyebrow="Cadastro" title="Novo cliente" />
      <ClienteForm action={criarCliente} />
    </div>
  );
}
