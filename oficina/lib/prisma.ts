import { PrismaClient } from "@prisma/client";

// ---------------------------------------------------------------------------
// Padrão Singleton do Prisma Client.
//
// Em desenvolvimento, o hot-reload do Next.js recriaria o PrismaClient a cada
// alteração de código, abrindo conexões novas e esgotando o limite do Postgres.
// Guardamos a instância em `globalThis` para reutilizá-la. Em produção (container
// Node de longa duração) o módulo já é carregado uma única vez por processo.
//
// Para limitar conexões por pod, use `?connection_limit=5` na DATABASE_URL.
// ---------------------------------------------------------------------------

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
