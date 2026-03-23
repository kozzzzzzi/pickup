import { NextResponse } from "next/server";
import * as QRCode from "qrcode";
import JSZip from "jszip";
import { db } from "@/lib/db";

function sanitizeFileName(name: string) {
  return name.replace(/[\\/:*?"<>|]/g, "").trim() || "pickup";
}

export async function GET() {
  const orders = await db.order.findMany({
    orderBy: { sheetRowIndex: "asc" },
  });

  const zip = new JSZip();

  for (const order of orders) {
    const png = await QRCode.toBuffer(order.token, {
      type: "png",
      margin: 1,
      scale: 8,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });

    const sameNameOrders = orders
  .filter(
    (item: (typeof orders)[number]) =>
      item.pickupPersonName === order.pickupPersonName
  )
  .sort(
    (a: (typeof orders)[number], b: (typeof orders)[number]) =>
      a.sheetRowIndex - b.sheetRowIndex
  );

    let fileName = sanitizeFileName(order.pickupPersonName);

    if (sameNameOrders.length > 1) {
      const index =
          (item: (typeof sameNameOrders)[number]) => item.id === order.id + 1;

      fileName = `${fileName}-${index}`;
    }

    zip.file(`${fileName}.png`, png);
  }

  const content = await zip.generateAsync({ type: "nodebuffer" });

  return new NextResponse(new Uint8Array(content), {
    status: 200,
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": 'attachment; filename="pickup-qrs.zip"',
    },
  });
}