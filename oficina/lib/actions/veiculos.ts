"use server";

import { prisma } from "@/lib/prisma";
import { veiculoSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { flatten, cleanEmpty, type FormState } from "./utils";

export async function criarVeiculo(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = veiculoSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { fieldErrors: flatten(parsed.error) };

  const existente = await prisma.veiculo.findUnique({ where: { placa: parsed.data.placa } });
  if (existente) return { error: "Já existe um veículo cadastrado com essa placa." };

  await prisma.veiculo.create({ data: cleanEmpty(parsed.data) });
  revalidatePath("/veiculos");
  redirect("/veiculos");
}

export async function atualizarVeiculo(id: string, _prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = veiculoSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { fieldErrors: flatten(parsed.error) };

  await prisma.veiculo.update({ where: { id }, data: cleanEmpty(parsed.data) });
  revalidatePath("/veiculos");
  redirect("/veiculos");
}

export async function excluirVeiculo(id: string) {
  await prisma.veiculo.delete({ where: { id } });
  revalidatePath("/veiculos");
}
