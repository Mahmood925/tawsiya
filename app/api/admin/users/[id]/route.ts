import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getSession, requireRole } from "@/lib/auth";
import { createNotification } from "@/lib/notify";

const ROLES = ["USER", "COACH", "ADMIN"];

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!requireRole(session, ["ADMIN"])) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const action = body?.action;

  const target = await prisma.user.findUnique({ where: { id: params.id } });
  if (!target) return NextResponse.json({ error: "المستخدم غير موجود" }, { status: 404 });

  if (action === "approve") {
    await prisma.user.update({ where: { id: target.id }, data: { status: "APPROVED" } });
    await createNotification(
      target.id,
      "ACCOUNT_APPROVED",
      "تم قبول حسابك",
      "رحّب بك إدارة المعهد في المنصة",
      "/feed"
    );
    return NextResponse.json({ ok: true });
  }

  if (action === "reject") {
    await prisma.user.update({ where: { id: target.id }, data: { status: "REJECTED" } });
    await createNotification(
      target.id,
      "ACCOUNT_REJECTED",
      "تم رفض طلبك",
      "لم يتم قبول طلب انضمامك إلى المنصة",
    );
    return NextResponse.json({ ok: true });
  }

  if (action === "setRole") {
    const role = body?.role;
    if (!ROLES.includes(role)) {
      return NextResponse.json({ error: "دور غير صالح" }, { status: 400 });
    }
    await prisma.user.update({ where: { id: target.id }, data: { role: role as Role } });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "إجراء غير معروف" }, { status: 400 });
}
