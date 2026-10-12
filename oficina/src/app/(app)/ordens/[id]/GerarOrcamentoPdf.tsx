"use client";

import { useState } from "react";

type ItemPdf = { descricao: string; quantidade: number; valorUnitario: number };

type Props = {
  numero: number;
  dataAbertura: string; // ISO
  cliente: { nome: string; telefone: string };
  veiculo: { placa: string; marca: string; modelo: string; ano: number | null };
  descricaoProblema: string;
  itens: ItemPdf[];
  valorTotal: number;
  oficina: { nome: string; endereco: string | null; telefone: string | null; email: string | null; validadeOrcamentoDias: number };
};

function formatBRL(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function GerarOrcamentoPdf(props: Props) {
  const [gerando, setGerando] = useState(false);

  async function gerar() {
    setGerando(true);
    try {
      // Importados dinamicamente: bibliotecas de PDF só rodam no navegador,
      // então evitamos incluí-las no bundle do servidor (Server Components).
      const { default: jsPDF } = await import("jspdf");
      const autoTable = (await import("jspdf-autotable")).default;

      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const margem = 40;
      let y = margem;

      // Cabeçalho — dados da oficina
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text(props.oficina.nome, margem, y);
      y += 18;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      const linhasOficina = [props.oficina.endereco, props.oficina.telefone, props.oficina.email].filter(Boolean);
      for (const linha of linhasOficina) {
        doc.text(String(linha), margem, y);
        y += 12;
      }

      // Título
      y += 10;
      doc.setDrawColor(200);
      doc.line(margem, y, 555, y);
      y += 24;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text(`Orçamento — Ordem de Serviço #${props.numero}`, margem, y);
      y += 16;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      const dataFormatada = new Date(props.dataAbertura).toLocaleDateString("pt-BR");
      doc.text(`Emitido em ${dataFormatada} — válido por ${props.oficina.validadeOrcamentoDias} dias`, margem, y);
      y += 24;

      // Cliente e veículo
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("Cliente", margem, y);
      doc.text("Veículo", 300, y);
      y += 14;
      doc.setFont("helvetica", "normal");
      doc.text(props.cliente.nome, margem, y);
      doc.text(`${props.veiculo.placa} — ${props.veiculo.marca} ${props.veiculo.modelo}`, 300, y);
      y += 14;
      doc.text(props.cliente.telefone, margem, y);
      if (props.veiculo.ano) doc.text(String(props.veiculo.ano), 300, y);
      y += 24;

      // Problema relatado
      doc.setFont("helvetica", "bold");
      doc.text("Problema relatado", margem, y);
      y += 14;
      doc.setFont("helvetica", "normal");
      const linhasProblema = doc.splitTextToSize(props.descricaoProblema, 515);
      doc.text(linhasProblema, margem, y);
      y += linhasProblema.length * 12 + 16;

      // Tabela de itens
      autoTable(doc, {
        startY: y,
        margin: { left: margem, right: margem },
        head: [["Descrição", "Qtd.", "Valor unit.", "Subtotal"]],
        body: props.itens.map((item) => [
          item.descricao,
          String(item.quantidade),
          formatBRL(item.valorUnitario),
          formatBRL(item.valorUnitario * item.quantidade),
        ]),
        styles: { fontSize: 9, cellPadding: 6 },
        headStyles: { fillColor: [27, 34, 39], textColor: 255 },
        alternateRowStyles: { fillColor: [245, 245, 243] },
      });

      // Total (depois da tabela, usa a posição final calculada pelo autoTable)
      const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 24;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text(`Total: ${formatBRL(props.valorTotal)}`, 555, finalY, { align: "right" });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(120);
      doc.text(
        "Este documento é um orçamento e não constitui nota fiscal. Valores sujeitos a confirmação após avaliação técnica.",
        margem,
        finalY + 30
      );

      doc.save(`orcamento-os-${props.numero}.pdf`);
    } finally {
      setGerando(false);
    }
  }

  return (
    <button
      onClick={gerar}
      disabled={gerando}
      className="rounded-sm border border-amber-500/40 px-4 py-2 text-sm font-semibold text-amber-400 transition hover:bg-amber-500/10 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {gerando ? "Gerando PDF…" : "Gerar orçamento em PDF"}
    </button>
  );
}
