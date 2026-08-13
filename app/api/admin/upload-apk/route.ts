import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { getSession, requireRole } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!requireRole(session, ["ADMIN"])) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }

  const formData = await req.formData();
  const file = formData.get("apk");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "لم يتم إرفاق ملف" }, { status: 400 });
  }

  const blob = await put("releases/tawsiya.apk", file, {
    access: "public",
    addRandomSuffix: false,
  });

  return NextResponse.json({ url: blob.url });
}
