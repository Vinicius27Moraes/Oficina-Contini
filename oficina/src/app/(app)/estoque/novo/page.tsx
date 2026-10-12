import { PageHeader } from "@/components/PageHeader";
import { PecaForm } from "../PecaForm";
import { criarPeca } from "@/lib/actions/pecas";

export default function NovaPecaPage() {
  return (
    <div>
      <PageHeader eyebrow="Estoque" title="Nova peça" />
      <PecaForm action={criarPeca} />
    </div>
  );
}
