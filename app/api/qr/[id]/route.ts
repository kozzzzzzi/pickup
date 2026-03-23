import { db } from "@/lib/db";
import * as QRCode from "qrcode";
import { generateToken } from "@/lib/token";

export const runtime = "nodejs";

type Props = {
  params: Promise<{ id: string }>;
};

function sanitizeFileName(name: string) {
  return name.replace(/[\\/:*?"<>|]/g, "").trim() || "pickup";
}

export async function GET(_: Request, { params }: Props) {
  try {
    const { id } = await params;

    const order = await db.order.findUnique({
      where: { id },
    });

    if (!order) {
      return new Response("Order not found", { status: 404 });
    }

    let token = order.token;

    if (!token) {
      token = generateToken();

      await db.order.update({
        where: { id: order.id },
        data: { token },
      });
    }

    const png = await QRCode.toBuffer(token, {
      type: "png",
      margin: 1,
      scale: 8,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });

    const fileName = sanitizeFileName(order.pickupPersonName);
const encodedFileName = encodeURIComponent(`${fileName}.png`);

return new Response(new Uint8Array(png), {
  status: 200,
  headers: {
    "Content-Type": "image/png",
    "Content-Disposition": `attachment; filename="qr.png"; filename*=UTF-8''${encodedFileName}`,
    "Cache-Control": "no-store",
  },
});
  } catch (error) {
    console.error("QR route error:", error);
    return new Response(
      error instanceof Error ? error.message : "QR route failed",
      { status: 500 }
    );
  }
}