import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyPassword, signSession, SESSION_COOKIE, SessionPayload } from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  if (!checkRateLimit(`login:${getClientIp(req)}`, 10, 5 * 60 * 1000)) {
    return NextResponse.json({ error: "محاولات كثيرة، حاول لاحقاً" }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "طلب غير صالح" }, { status: 400 });

  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: "بيانات الدخول غير صحيحة" }, { status: 401 });
  }

  const validPassword = await verifyPassword(password, user.passwordHash);
  if (!validPassword) {
    return NextResponse.json({ error: "بيانات الدخول غير صحيحة" }, { status: 401 });
  }

  if (user.status === "PENDING") {
    return NextResponse.json({ error: "حسابك قيد المراجعة من الإدارة", status: "PENDING" }, { status: 403 });
  }
  if (user.status === "REJECTED") {
    return NextResponse.json({ error: "تم رفض طلب حسابك" }, { status: 403 });
  }

  const token = await signSession({
    sub: user.id,
    name: user.name,
    role: user.role as SessionPayload["role"],
    status: user.status as SessionPayload["status"],
  });

  const res = NextResponse.json({ ok: true, role: user.role });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
