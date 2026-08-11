import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "طلب غير صالح" }, { status: 400 });

  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim().toLowerCase();
  const phone = body.phone ? String(body.phone).trim() : null;
  const password = String(body.password || "");

  if (!name || !email || !password) {
    return NextResponse.json({ error: "الاسم والبريد وكلمة المرور مطلوبة" }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: "كلمة المرور يجب ألا تقل عن 6 أحرف" }, { status: 400 });
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ error: "البريد الإلكتروني غير صالح" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "هذا البريد مسجّل بالفعل" }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);
  await prisma.user.create({
    data: { name, email, phone, passwordHash, role: "USER", status: "PENDING" },
  });

  return NextResponse.json({ ok: true });
}
