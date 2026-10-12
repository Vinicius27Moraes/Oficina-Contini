"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { usuarioSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { flatten, type FormState } from "./utils";

async function exigirMaster() {
  const session = await auth();
  if (session?.user.role !== "MASTER") {
    throw new Error("Apenas o usuário master pode gerenciar usuários.");
  }
  return session;
}

export async function criarUsuario(_prev: FormState, formData: FormData): Promise<FormState> {
  await exigirMaster();

  const parsed = usuarioSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { fieldErrors: flatten(parsed.error) };

  const email = parsed.data.email.toLowerCase();
  const existente = await prisma.usuario.findUnique({ where: { email } });
  if (existente) return { error: "Já existe um usuário cadastrado com esse e-mail." };

  const senhaHash = await bcrypt.hash(parsed.data.senha, 10);

  await prisma.usuario.create({
    data: { nome: parsed.data.nome, email, senhaHash, role: parsed.data.role },
  });

  revalidatePath("/usuarios");
  redirect("/usuarios");
}

export async function alternarStatusUsuario(id: string, ativo: boolean) {
  const session = await exigirMaster();
  if (session?.user.id === id && !ativo) {
    throw new Error("Você não pode desativar o próprio usuário.");
  }
  await prisma.usuario.update({ where: { id }, data: { ativo } });
  revalidatePath("/usuarios");
}

export async function excluirUsuario(id: string) {
  const session = await exigirMaster();
  if (session?.user.id === id) {
    throw new Error("Você não pode excluir o próprio usuário.");
  }
  const alvo = await prisma.usuario.findUnique({ where: { id } });
  if (alvo?.role === "MASTER") {
    throw new Error("Usuários master não podem ser excluídos, apenas desativados.");
  }
  await prisma.usuario.delete({ where: { id } });
  revalidatePath("/usuarios");
}

export async function redefinirSenha(id: string, novaSenha: string) {
  await exigirMaster();
  if (novaSenha.length < 8) {
    throw new Error("A nova senha precisa ter pelo menos 8 caracteres.");
  }
  const senhaHash = await bcrypt.hash(novaSenha, 10);
  await prisma.usuario.update({ where: { id }, data: { senhaHash } });
  revalidatePath("/usuarios");
}
