import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { createNotification } from "@/lib/notify";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session || session.status !== "APPROVED") {
    return NextResponse.json({ error: "يجب تسجيل الدخول" }, { status: 401 });
  }

  const post = await prisma.post.findUnique({ where: { id: params.id }, select: { id: true, authorId: true } });
  if (!post) return NextResponse.json({ error: "المنشور غير موجود" }, { status: 404 });

  const existing = await prisma.like.findUnique({
    where: { postId_userId: { postId: post.id, userId: session.sub } },
  });

  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } });
    return NextResponse.json({ liked: false });
  }

  await prisma.like.create({ data: { postId: post.id, userId: session.sub } });
  if (post.authorId !== session.sub) {
    await createNotification(
      post.authorId,
      "NEW_LIKE",
      "إعجاب جديد",
      `${session.name} أعجب بمنشورك`,
      `/feed/${post.id}`
    );
  }
  return NextResponse.json({ liked: true });
}
