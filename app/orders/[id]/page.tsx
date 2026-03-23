import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import DownloadQrButton from "@/app/components/download-qr-button";
import OrderActionPanel from "@/app/components/order-action-panel";
import CopyQrLinkButton from "@/app/components/copy-qr-link-button";

type Props = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params;

  const order = await db.order.findUnique({
    where: { id },
  });

  if (!order) notFound();

  const items = order.items as { name: string; quantity: number }[];
  const received = order.status === "received";

  return (
    <div>
      <div className="detail-head">
        <div className="detail-name">{order.pickupPersonName}</div>
        <div className="detail-date">{order.pickupDate} 현장수령</div>
      </div>

      <div className="detail-section">
        <div className="detail-label">품목</div>
        <div className="item-list">
          {items.map((item) => (
            <div key={item.name} className="item-row">
              {item.name} - {item.quantity}개
            </div>
          ))}
        </div>
      </div>

      <div className="detail-section">
        <div className="detail-label">상태</div>
        <div className="item-row">{received ? "수령 완료" : "미수령"}</div>
      </div>

      <div className="mini-info">
        연락처 {order.phone}
        <br />
        이메일 {order.email}
        <br />
        입금자명 {order.depositorName}
        <br />
        입금액 {order.depositAmount.toLocaleString("ko-KR")}원
        <br />
        입금날짜 {order.depositDate}
        <br />
        입금시간 {order.depositTime}
      </div>

      <div className="section">
  <OrderActionPanel
    orderId={order.id}
    initialReceived={received}
  />

  <div style={{ height: 10 }} />

  <div style={{ display: "flex", gap: 8 }}>
  <div style={{ flex: 1 }}>
    <DownloadQrButton
      orderId={order.id}
      fileName={order.pickupPersonName}
    />
  </div>

  <div style={{ flex: 1 }}>
    <CopyQrLinkButton orderId={order.id} />
  </div>
</div>

  <Link href="/scan" className="ghost-link">
    다시 스캔
  </Link>
</div>
    </div>
  );
}