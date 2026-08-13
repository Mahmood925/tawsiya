import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "لا توجد جلسة" }, { status: 401 });
  return NextResponse.json({
    id: session.sub,
    name: session.name,
    role: session.role,
    status: session.status,
  });
}
