import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE = "session";

type SessionPayload = {
  sub: string;
  name: string;
  role: "USER" | "COACH" | "ADMIN";
  status: "PENDING" | "APPROVED" | "REJECTED";
};

async function readSession(req: NextRequest): Promise<SessionPayload | null> {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

const PROTECTED_PREFIXES = ["/feed", "/notifications", "/profile", "/admin"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"));
  const isAuthPage = pathname === "/login" || pathname === "/register";

  const session = await readSession(req);

  if (isProtected) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (session.status === "PENDING") {
      return NextResponse.redirect(new URL("/pending", req.url));
    }
    if (session.status === "REJECTED") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (pathname.startsWith("/admin") && session.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/feed", req.url));
    }
    if (pathname.startsWith("/feed/new") && session.role !== "COACH" && session.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/feed", req.url));
    }
  }

  if (isAuthPage && session && session.status === "APPROVED") {
    return NextResponse.redirect(new URL("/feed", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/feed/:path*", "/notifications/:path*", "/profile/:path*", "/admin/:path*", "/login", "/register"],
};
