"use server";

import { prisma } from "@/lib/prisma";
import { clienteSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { flatten, cleanEmpty, type FormState } from "./utils";

export async function criarCliente(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = clienteSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { fieldErrors: flatten(parsed.error) };

  await prisma.cliente.create({ data: cleanEmpty(parsed.data) });
  revalidatePath("/clientes");
  redirect("/clientes");
}

export async function atualizarCliente(id: string, _prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = clienteSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { fieldErrors: flatten(parsed.error) };

  await prisma.cliente.update({ where: { id }, data: cleanEmpty(parsed.data) });
  revalidatePath("/clientes");
  redirect("/clientes");
}

export async function excluirCliente(id: string) {
  await prisma.cliente.delete({ where: { id } });
  revalidatePath("/clientes");
}
