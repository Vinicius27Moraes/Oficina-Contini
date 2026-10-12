"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { flatten, cleanEmpty, type FormState } from "./utils";

const configuracaoSchema = z.object({
  nome: z.string().min(2, "Informe o nome da oficina"),
  endereco: z.string().optional().or(z.literal("")),
  telefone: z.string().optional().or(z.literal("")),
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
  validadeOrcamentoDias: z.coerce.number().int().min(1).max(90),
});

export async function atualizarConfiguracao(_prev: FormState, formData: FormData): Promise<FormState> {
  const session = await auth();
  if (session?.user.role !== "MASTER") {
    return { error: "Apenas o usuário master pode alterar as configurações." };
  }

  const parsed = configuracaoSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { fieldErrors: flatten(parsed.error) };

  await prisma.configuracaoOficina.upsert({
    where: { id: "default" },
    update: cleanEmpty(parsed.data),
    create: { id: "default", ...cleanEmpty(parsed.data) },
  });

  revalidatePath("/configuracoes");
  revalidatePath("/ordens");
  return {};
}
