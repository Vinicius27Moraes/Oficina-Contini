import { NextResponse } from "next/server";

// Liveness: só confirma que o processo Node está respondendo (não toca no banco).
export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({ status: "ok" });
}
