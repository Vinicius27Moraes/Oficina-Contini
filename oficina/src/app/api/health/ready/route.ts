import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Readiness: confirma que o app consegue falar com o banco. Enquanto falhar,
// o Kubernetes não envia tráfego para este pod.
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ status: "ready" });
  } catch {
    return NextResponse.json({ status: "db_unavailable" }, { status: 503 });
  }
}
