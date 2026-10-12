import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  // roda em todas as rotas, exceto assets estáticos, auth e health checks do Kubernetes
  matcher: ["/((?!api/auth|api/health|_next/static|_next/image|favicon.ico).*)"],
};