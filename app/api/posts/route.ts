import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { put } from "@vercel/blob";
import { prisma } from "@/lib/db";
import { getSession, requireRole } from "@/lib/auth";
import { notifyMany } from "@/lib/notify";
import { getFeedPosts } from "@/lib/posts";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_CATEGORIES = ["analysis", "news"];

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session || session.status !== "APPROVED") {
    return NextResponse.json({ error: "يجب تسجيل الدخول" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");

  const posts = await getFeedPosts(session.sub, category);
  return NextResponse.json({ posts });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!requireRole(session, ["COACH", "ADMIN"])) {
    return NextResponse.json({ error: "غير مصرح لك بالنشر" }, { status: 403 });
  }

  const formData = await req.formData();
  const category = String(formData.get("category") || "");
  const title = formData.get("title") ? String(formData.get("title")).slice(0, 150) : null;
  const bodyText = String(formData.get("body") || "").trim().slice(0, 5000);

  if (!ALLOWED_CATEGORIES.includes(category)) {
    return NextResponse.json({ error: "نوع المنشور غير صالح" }, { status: 400 });
  }
  if (!bodyText) {
    return NextResponse.json({ error: "نص المنشور مطلوب" }, { status: 400 });
  }

  const files = formData.getAll("images").filter((f): f is File => f instanceof File && f.size > 0);
  const savedUrls: string[] = [];

  for (const file of files) {
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "الملفات المرفقة يجب أن تكون صوراً" }, { status: 400 });
    }
    if (file.size > MAX_IMAGE_BYTES) {
      return NextResponse.json({ error: "حجم الصورة يجب ألا يتجاوز 5 ميجابايت" }, { status: 400 });
    }
    const ext = (file.type.split("/")[1] || "jpg").replace(/[^a-z0-9]/gi, "");
    const filename = `${randomUUID()}.${ext}`;
    const blob = await put(`posts/${filename}`, file, { access: "public" });
    savedUrls.push(blob.url);
  }

  const post = await prisma.post.create({
    data: {
      authorId: session.sub,
      category,
      title,
      body: bodyText,
      images: { create: savedUrls.map((url) => ({ url })) },
    },
  });

  const recipients = await prisma.user.findMany({
    where: { status: "APPROVED", id: { not: session.sub } },
    select: { id: true },
  });
  await notifyMany(
    recipients.map((r) => r.id),
    "NEW_POST",
    category === "analysis" ? "تحليل جديد" : "خبر جديد",
    title || bodyText.slice(0, 80),
    `/feed/${post.id}`
  );

  return NextResponse.json({ ok: true, id: post.id });
}
