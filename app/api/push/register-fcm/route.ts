import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "يجب تسجيل الدخول" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const token = String(body?.token || "").trim();
  if (!token) return NextResponse.json({ error: "الرمز مطلوب" }, { status: 400 });

  await prisma.fcmToken.upsert({
    where: { token },
    create: { userId: session.sub, token },
    update: { userId: session.sub },
  });

  return NextResponse.json({ ok: true });
}
