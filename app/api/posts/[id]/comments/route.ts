import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { createNotification } from "@/lib/notify";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session || session.status !== "APPROVED") {
    return NextResponse.json({ error: "يجب تسجيل الدخول" }, { status: 401 });
  }

  const comments = await prisma.comment.findMany({
    where: { postId: params.id },
    orderBy: { createdAt: "asc" },
    include: { user: { select: { id: true, name: true } } },
  });
  return NextResponse.json({ comments });
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session || session.status !== "APPROVED") {
    return NextResponse.json({ error: "يجب تسجيل الدخول" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const text = String(body?.text || "").trim();
  if (!text) return NextResponse.json({ error: "التعليق فارغ" }, { status: 400 });

  const post = await prisma.post.findUnique({ where: { id: params.id }, select: { id: true, authorId: true } });
  if (!post) return NextResponse.json({ error: "المنشور غير موجود" }, { status: 404 });

  const comment = await prisma.comment.create({
    data: { postId: post.id, userId: session.sub, text },
    include: { user: { select: { id: true, name: true } } },
  });

  if (post.authorId !== session.sub) {
    await createNotification(
      post.authorId,
      "NEW_COMMENT",
      "تعليق جديد",
      `${session.name}: ${text.slice(0, 60)}`,
      `/feed/${post.id}`
    );
  }

  return NextResponse.json({ comment });
}
