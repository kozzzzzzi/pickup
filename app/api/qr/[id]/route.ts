import { NextResponse } from "next/server";
import * as QRCode from "qrcode";
import { db } from "@/lib/db";

type Props = {
  params: Promise<{ id: string }>;
};

function sanitizeFileName(name: string) {
  return name.replace(/[\\/:*?"<>|]/g, "").trim() || "pickup";
}

export async function GET(_: Request, { params }: Props) {
  const { id } = await params;

  const order = await db.order.findUnique({
    where: { id },
  });

  if (!order) {
    return new NextResponse("Not found", { status: 404 });
  }

  const png = await QRCode.toBuffer(order.token, {
    type: "png",
    margin: 1,
    scale: 8,
    color: {
      dark: "#000000",
      light: "#FFFFFF",
    },
  });

  const fileName = sanitizeFileName(order.pickupPersonName);

  return new NextResponse(png, {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Content-Disposition": `attachment; filename="${fileName}.png"`,
    },
  });
}