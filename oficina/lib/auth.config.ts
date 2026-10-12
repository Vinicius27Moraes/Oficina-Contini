import type { NextAuthConfig } from "next-auth";

// Esta configuração NÃO importa Prisma nem bcrypt de propósito: ela é usada
// pelo middleware, que roda em Edge Runtime e não suporta essas bibliotecas.
// A lógica de autenticação (que precisa do banco) fica em lib/auth.ts,
// usada apenas em Server Components, Server Actions e na rota /api/auth.
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const logado = !!auth?.user;
      const naTelaDeLogin = nextUrl.pathname.startsWith("/login");

      if (naTelaDeLogin) {
        // já logado tentando ver /login -> manda para o painel
        if (logado) return Response.redirect(new URL("/", nextUrl));
        return true;
      }

      // qualquer outra rota exige login; se não estiver logado, o Auth.js
      // redireciona automaticamente para a página definida em `pages.signIn`
      return logado;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = (user as { role: "MASTER" | "PADRAO" }).role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "MASTER" | "PADRAO";
      }
      return session;
    },
  },
  providers: [], // provider real (Credentials + Prisma) é adicionado em lib/auth.ts
} satisfies NextAuthConfig;
