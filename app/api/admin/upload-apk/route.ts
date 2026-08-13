import { NextRequest, NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { del } from "@vercel/blob";
import { getSession, requireRole } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!requireRole(session, ["ADMIN"])) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }

  const body = (await req.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async () => {
        await del("releases/tawsiya.apk").catch(() => null);
        return {
          allowedContentTypes: ["application/vnd.android.package-archive"],
          addRandomSuffix: false,
        };
      },
      onUploadCompleted: async () => {},
    });
    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
