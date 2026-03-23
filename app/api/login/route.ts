import { NextResponse } from "next/server";
import { createSession } from "@/lib/auth";

export async function POST(request: Request) {
  const formData = await request.formData();
  const username = String(formData.get("username") || "");
  const password = String(formData.get("password") || "");

  const adminId = process.env.ADMIN_USERNAME || "admin";
  const adminPw = process.env.ADMIN_PASSWORD || "1234";

  if (username !== adminId || password !== adminPw) {
    return NextResponse.json(
      { ok: false, message: "invalid_credentials" },
      { status: 401 }
    );
  }

  await createSession(true);

  return NextResponse.json({ ok: true });
}