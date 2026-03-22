import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";

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
        <a href={`/api/qr/${order.id}`}>
          <button className="secondary-button">QR 다운로드</button>
        </a>

        <div style={{ height: 10 }} />

        {received ? (
          <form action={`/api/orders/${order.id}/undo`} method="post">
            <button className="secondary-button" type="submit">
              수령 완료 취소
            </button>
          </form>
        ) : (
          <form action={`/api/orders/${order.id}/receive`} method="post">
            <button className="primary-button" type="submit">
              수령 완료
            </button>
          </form>
        )}

        <Link href="/scan" className="ghost-link">
          다시 스캔
        </Link>
      </div>
    </div>
  );
}