import OrdersListClient from "./orders-list-client";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const rows = await db.order.findMany({
    orderBy: { sheetRowIndex: "asc" },
  });

  const orders = rows.map((row: (typeof rows)[number]) => ({
    id: row.id,
    pickupPersonName: row.pickupPersonName,
    phone: row.phone,
    pickupDate: row.pickupDate,
    status: row.status,
    items: row.items as { name: string; quantity: number }[],
  }));

  return <OrdersListClient orders={orders} />;
}