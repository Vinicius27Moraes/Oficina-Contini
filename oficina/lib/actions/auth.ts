"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/lib/auth";

export async function autenticar(_prevState: string | undefined, formData: FormData): Promise<string | undefined> {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      senha: formData.get("senha"),
      redirectTo: "/",
    });
  } catch (error) {
    // O signIn bem-sucedido lança um erro especial de redirecionamento —
    // precisamos deixá-lo passar, só tratamos erros de autenticação de fato.
    if (error instanceof AuthError) {
      return "E-mail ou senha inválidos.";
    }
    throw error;
  }
}
