import { NextResponse } from "next/server";
import { createSession } from "@/lib/auth";

export async function POST(request: Request) {
  const formData = await request.formData();
  const username = String(formData.get("username") || "");
  const password = String(formData.get("password") || "");
  const remember = String(formData.get("remember") || "") === "on";

  const adminId = process.env.ADMIN_USERNAME || "admin";
  const adminPw = process.env.ADMIN_PASSWORD || "1234";

  if (username !== adminId || password !== adminPw) {
    return NextResponse.redirect(new URL("/login?error=1", request.url));
  }

  await createSession(remember);

  return NextResponse.redirect(new URL("/dashboard", request.url));
}