import { NextResponse } from "next/server";
import { fetchImportedOrders } from "@/lib/import-source";
import { db } from "@/lib/db";
import { generateToken } from "@/lib/token";

export async function GET() {
  try {
    const orders = await db.order.findMany({
      orderBy: { sheetRowIndex: "asc" },
    });

    const syncState = await db.syncState.findUnique({
      where: { id: "main" },
    });

    return NextResponse.json({
      ok: true,
      count: orders.length,
      items: orders,
      updatedAt: syncState?.updatedAt ?? null,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "failed",
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const imported = await fetchImportedOrders();

    for (const item of imported) {
      const existing = await db.order.findUnique({
        where: { sheetRowIndex: item.rowIndex },
      });

      if (existing) {
        await db.order.update({
          where: { sheetRowIndex: item.rowIndex },
          data: {
            pickupDate: item.pickupDate,
            pickupPersonName: item.pickupPersonName,
            email: item.email,
            phone: item.phone,
            depositorName: item.depositorName,
            depositAmount: item.depositAmount,
            depositDate: item.depositDate,
            depositTime: item.depositTime,
            items: item.items,
          },
        });
      } else {
        await db.order.create({
          data: {
            sheetRowIndex: item.rowIndex,
            token: generateToken(),
            pickupDate: item.pickupDate,
            pickupPersonName: item.pickupPersonName,
            email: item.email,
            phone: item.phone,
            depositorName: item.depositorName,
            depositAmount: item.depositAmount,
            depositDate: item.depositDate,
            depositTime: item.depositTime,
            items: item.items,
            status: "pending",
          },
        });
      }
    }

    await db.syncState.upsert({
      where: { id: "main" },
      update: { updatedAt: new Date() },
      create: { id: "main", updatedAt: new Date() },
    });

    const orders = await db.order.findMany({
      orderBy: { sheetRowIndex: "asc" },
    });

    return NextResponse.json({
      ok: true,
      count: orders.length,
      items: orders,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "import failed",
      },
      { status: 500 }
    );
  }
}