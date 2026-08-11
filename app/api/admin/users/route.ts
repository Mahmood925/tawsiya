import { NextRequest, NextResponse } from "next/server";
import { Role, Status } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getSession, requireRole, hashPassword } from "@/lib/auth";

const ROLES = ["USER", "COACH", "ADMIN"] as const;

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!requireRole(session, ["ADMIN"])) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  const users = await prisma.user.findMany({
    where: status ? { status: status as Status } : undefined,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      status: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ users });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!requireRole(session, ["ADMIN"])) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "طلب غير صالح" }, { status: 400 });

  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  const role = String(body.role || "COACH");

  if (!name || !email || !password) {
    return NextResponse.json({ error: "الاسم والبريد وكلمة المرور مطلوبة" }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: "كلمة المرور يجب ألا تقل عن 6 أحرف" }, { status: 400 });
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ error: "البريد الإلكتروني غير صالح" }, { status: 400 });
  }
  if (!(ROLES as readonly string[]).includes(role)) {
    return NextResponse.json({ error: "دور غير صالح" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "هذا البريد مسجّل بالفعل" }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: { name, email, passwordHash, role: role as Role, status: "APPROVED" },
    select: { id: true, name: true, email: true, role: true, status: true, createdAt: true },
  });

  return NextResponse.json({ user });
}
