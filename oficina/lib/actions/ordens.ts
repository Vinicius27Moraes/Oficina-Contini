"use server";

import { prisma } from "@/lib/prisma";
import { ordemSchema, itemOrdemSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { flatten, cleanEmpty, type FormState } from "./utils";
import type { StatusOrdem } from "@prisma/client";

export async function criarOrdem(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = ordemSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { fieldErrors: flatten(parsed.error) };

  const veiculo = await prisma.veiculo.findUnique({ where: { id: parsed.data.veiculoId }, select: { clienteId: true } });
  if (!veiculo || veiculo.clienteId !== parsed.data.clienteId) {
    return { fieldErrors: { veiculoId: "Selecione um veículo pertencente ao cliente escolhido." } };
  }

  const ordem = await prisma.ordemServico.create({ data: cleanEmpty(parsed.data) });
  revalidatePath("/ordens");
  redirect(`/ordens/${ordem.id}?salvo=1`);
}

export async function adicionarItem(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = itemOrdemSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { fieldErrors: flatten(parsed.error) };

  const { ordemId, pecaId, quantidade, ...rest } = cleanEmpty(parsed.data);

  try {
    await prisma.$transaction(async (tx) => {
      const ordem = await tx.ordemServico.findUnique({ where: { id: ordemId }, select: { status: true } });
      if (!ordem) throw new Error("A ordem de serviço não foi encontrada.");
      if (ordem.status === "FINALIZADA" || ordem.status === "CANCELADA") {
        throw new Error("Não é possível alterar itens de uma ordem finalizada ou cancelada.");
      }

      // A baixa condicional evita que operações simultâneas deixem o estoque negativo.
      if (pecaId) {
        const baixa = await tx.peca.updateMany({
          where: { id: pecaId, quantidade: { gte: quantidade } },
          data: { quantidade: { decrement: quantidade } },
        });
        if (baixa.count === 0) throw new Error("Estoque insuficiente para a quantidade informada.");
      }

      await tx.itemOrdemServico.create({
        data: { ordemId, pecaId: pecaId || null, quantidade, ...rest },
      });
      await recalcularTotal(tx, ordemId);
    });
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Não foi possível adicionar o item." };
  }

  revalidatePath(`/ordens/${ordemId}`);
  return { success: pecaId ? "Item adicionado e estoque atualizado." : "Item adicionado à ordem." };
}

export async function removerItem(ordemId: string, itemId: string) {
  await prisma.$transaction(async (tx) => {
    const ordem = await tx.ordemServico.findUnique({ where: { id: ordemId }, select: { status: true } });
    if (!ordem || ordem.status === "FINALIZADA" || ordem.status === "CANCELADA") {
      throw new Error("Esta ordem não permite alterações de itens.");
    }
    const item = await tx.itemOrdemServico.findUnique({ where: { id: itemId } });
    if (!item) return;

    if (item.pecaId) {
      await tx.peca.update({
        where: { id: item.pecaId },
        data: { quantidade: { increment: item.quantidade } },
      });
    }

    await tx.itemOrdemServico.delete({ where: { id: itemId } });
    await recalcularTotal(tx, ordemId);
  });

  revalidatePath(`/ordens/${ordemId}`);
}

export async function atualizarStatus(ordemId: string, status: StatusOrdem) {
  await prisma.ordemServico.update({
    where: { id: ordemId },
    data: {
      status,
      dataFechamento: status === "FINALIZADA" || status === "CANCELADA" ? new Date() : null,
    },
  });
  revalidatePath(`/ordens/${ordemId}`);
  revalidatePath("/ordens");
}

async function recalcularTotal(tx: Parameters<Parameters<typeof prisma.$transaction>[0]>[0], ordemId: string) {
  const itens = await tx.itemOrdemServico.findMany({ where: { ordemId } });
  const total = itens.reduce((acc, item) => acc + Number(item.valorUnitario) * item.quantidade, 0);
  await tx.ordemServico.update({ where: { id: ordemId }, data: { valorTotal: total } });
}
