import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "MASTER" | "PADRAO";
    } & DefaultSession["user"];
  }

  interface User {
    role: "MASTER" | "PADRAO";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "MASTER" | "PADRAO";
  }
}
