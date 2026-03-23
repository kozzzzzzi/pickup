import { db } from "@/lib/db";
import * as QRCode from "qrcode";

export const runtime = "nodejs";

type Props = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, { params }: Props) {
  try {
    const { id } = await params;

    const order = await db.order.findUnique({
      where: { id },
    });

    if (!order) {
      return new Response("Order not found", { status: 404 });
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

    return new Response(new Uint8Array(png), {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": 'inline; filename="qr.png"',
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("QR PNG route error:", error);
    return new Response(
      error instanceof Error ? error.message : "QR route failed",
      { status: 500 }
    );
  }
}