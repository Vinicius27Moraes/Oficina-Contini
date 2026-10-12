"use server";

import { prisma } from "@/lib/prisma";
import { funcionarioSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { flatten, cleanEmpty, type FormState } from "./utils";

export async function criarFuncionario(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = funcionarioSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { fieldErrors: flatten(parsed.error) };

  await prisma.funcionario.create({ data: cleanEmpty(parsed.data) });
  revalidatePath("/funcionarios");
  redirect("/funcionarios");
}

export async function alternarStatusFuncionario(id: string, ativo: boolean) {
  await prisma.funcionario.update({ where: { id }, data: { ativo } });
  revalidatePath("/funcionarios");
}

export async function excluirFuncionario(id: string) {
  await prisma.funcionario.delete({ where: { id } });
  revalidatePath("/funcionarios");
}
