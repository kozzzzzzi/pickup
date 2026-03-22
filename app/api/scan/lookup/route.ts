import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token")?.trim() || "";

  if (!token) {
    return NextResponse.json(
      { ok: false, reason: "missing_token" },
      { status: 400 }
    );
  }

  const order = await db.order.findUnique({
    where: { token },
  });

  if (!order) {
    return NextResponse.json(
      { ok: false, reason: "not_found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    ok: true,
    orderId: order.id,
  });
}