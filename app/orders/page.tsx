import OrdersListClient from "./orders-list-client";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const rows = await db.order.findMany();

  const orders = rows
  .map((row: (typeof rows)[number]) => ({
    id: row.id,
    pickupPersonName: row.pickupPersonName,
    phone: row.phone,
    pickupDate: row.pickupDate,
    status: row.status,
    items: row.items as { name: string; quantity: number }[],
  }))
  .sort((a: (typeof rows)[number] extends infer R ? {
    id: string;
    pickupPersonName: string;
    phone: string;
    pickupDate: string;
    status: string;
    items: { name: string; quantity: number }[];
  } : never, b: typeof a) => {
  const [am, ad] = (a.pickupDate || "0/0").split("/").map(Number);
  const [bm, bd] = (b.pickupDate || "0/0").split("/").map(Number);

  if (am !== bm) return am - bm;
  if (ad !== bd) return ad - bd;

  return a.pickupPersonName.localeCompare(b.pickupPersonName, "ko");
});

  return <OrdersListClient orders={orders} />;
}