"use server";

import { prisma } from "@/lib/prisma";
import { pecaSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { flatten, cleanEmpty, type FormState } from "./utils";

export async function criarPeca(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = pecaSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { fieldErrors: flatten(parsed.error) };

  const existente = await prisma.peca.findUnique({ where: { codigo: parsed.data.codigo } });
  if (existente) return { error: "Já existe uma peça cadastrada com esse código." };

  await prisma.peca.create({ data: cleanEmpty(parsed.data) });
  revalidatePath("/estoque");
  redirect("/estoque");
}

export async function atualizarPeca(id: string, _prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = pecaSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { fieldErrors: flatten(parsed.error) };

  await prisma.peca.update({ where: { id }, data: cleanEmpty(parsed.data) });
  revalidatePath("/estoque");
  redirect("/estoque");
}

export async function excluirPeca(id: string) {
  await prisma.peca.delete({ where: { id } });
  revalidatePath("/estoque");
}
