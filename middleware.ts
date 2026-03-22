import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const protectedPaths = ["/dashboard", "/orders", "/scan"];

async function isAuthed(request: NextRequest) {
  const token = request.cookies.get("pickup_admin_session")?.value;
  if (!token) return false;

  try {
    await jwtVerify(
      token,
      new TextEncoder().encode(process.env.ADMIN_JWT_SECRET || "dev-secret-change-this")
    );
    return true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const needsAuth = protectedPaths.some((path) => pathname.startsWith(path));

  if (!needsAuth) return NextResponse.next();

  const ok = await isAuthed(request);
  if (ok) return NextResponse.next();

  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: ["/dashboard/:path*", "/orders/:path*", "/scan/:path*"],
};