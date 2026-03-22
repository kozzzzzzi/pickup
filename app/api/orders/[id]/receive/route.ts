import { NextResponse } from "next/server";
import { db } from "@/lib/db";

type Props = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, { params }: Props) {
  const { id } = await params;

  await db.order.update({
    where: { id },
    data: { status: "received" },
  });

  return NextResponse.redirect(new URL(`/orders/${id}`, request.url));
}