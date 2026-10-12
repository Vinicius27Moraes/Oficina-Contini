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

  const ordem = await prisma.ordemServico.create({ data: cleanEmpty(parsed.data) });
  revalidatePath("/ordens");
  redirect(`/ordens/${ordem.id}`);
}

export async function adicionarItem(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = itemOrdemSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { fieldErrors: flatten(parsed.error) };

  const { ordemId, pecaId, quantidade, ...rest } = cleanEmpty(parsed.data);

  await prisma.$transaction(async (tx) => {
    await tx.itemOrdemServico.create({
      data: { ordemId, pecaId: pecaId || null, quantidade, ...rest },
    });

    // Baixa automática no estoque quando o item está vinculado a uma peça.
    if (pecaId) {
      await tx.peca.update({
        where: { id: pecaId },
        data: { quantidade: { decrement: quantidade } },
      });
    }

    await recalcularTotal(tx, ordemId);
  });

  revalidatePath(`/ordens/${ordemId}`);
  return {};
}

export async function removerItem(ordemId: string, itemId: string) {
  await prisma.$transaction(async (tx) => {
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
