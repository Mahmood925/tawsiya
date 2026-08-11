import { NextRequest, NextResponse } from "next/server";
import { del } from "@vercel/blob";
import { prisma } from "@/lib/db";
import { getSession, requireRole } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();

  const post = await prisma.post.findUnique({
    where: { id: params.id },
    include: {
      author: { select: { id: true, name: true } },
      images: true,
      comments: {
        orderBy: { createdAt: "asc" },
        include: { user: { select: { id: true, name: true } } },
      },
      _count: { select: { likes: true } },
      likes: session ? { where: { userId: session.sub }, select: { id: true } } : false,
    },
  });

  if (!post) return NextResponse.json({ error: "المنشور غير موجود" }, { status: 404 });

  return NextResponse.json({
    id: post.id,
    category: post.category,
    title: post.title,
    body: post.body,
    createdAt: post.createdAt.toISOString(),
    author: post.author,
    images: post.images.map((i) => ({ id: i.id, url: i.url })),
    likeCount: post._count.likes,
    likedByMe: session ? post.likes.length > 0 : false,
    comments: post.comments.map((c) => ({
      id: c.id,
      text: c.text,
      createdAt: c.createdAt.toISOString(),
      user: c.user,
    })),
  });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!requireRole(session, ["ADMIN"])) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }
  const post = await prisma.post.findUnique({ where: { id: params.id }, include: { images: true } });
  await prisma.notification.deleteMany({ where: { link: `/feed/${params.id}` } });
  await prisma.post.delete({ where: { id: params.id } }).catch(() => null);
  if (post) {
    await Promise.all(post.images.map((img) => del(img.url).catch(() => null)));
  }
  return NextResponse.json({ ok: true });
}
