"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export type DbOrderView = {
  id: string;
  pickupPersonName: string;
  phone: string;
  pickupDate: string;
  status: string;
  items: { name: string; quantity: number }[];
};

type StatusFilter = "all" | "pending" | "received";

export default function OrdersListClient({
  orders,
}: {
  orders: DbOrderView[];
}) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const filtered = useMemo(() => {
    const q = query.replaceAll("-", "").trim().toLowerCase();

    return orders.filter((order) => {
      const phone = order.phone.replaceAll("-", "");

      const matchesQuery =
        !q ||
        order.pickupPersonName.toLowerCase().includes(q) ||
        phone.includes(q);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "pending" && order.status === "pending") ||
        (statusFilter === "received" && order.status === "received");

      return matchesQuery && matchesStatus;
    });
  }, [orders, query, statusFilter]);

  return (
    <div>
      <h1 className="page-title">주문</h1>
      <p className="page-subtitle">
        이름이나 전화번호로 빠르게 찾을 수 있습니다.
      </p>

      <div style={{ marginTop: 10, display: "flex", justifyContent: "flex-end" }}>
        <a href="/api/qr/all" style={{ fontSize: 12, color: "#666" }}>
          전체 QR 다운로드
        </a>
      </div>

      <div className="search-wrap">
        <input
          className="search-box"
          placeholder="이름 또는 전화번호 검색"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="filter-row">
        <button
          className={`filter-chip${statusFilter === "all" ? " active" : ""}`}
          onClick={() => setStatusFilter("all")}
        >
          전체
        </button>

        <button
          className={`filter-chip${statusFilter === "pending" ? " active" : ""}`}
          onClick={() => setStatusFilter("pending")}
        >
          미수령
        </button>

        <button
          className={`filter-chip${statusFilter === "received" ? " active" : ""}`}
          onClick={() => setStatusFilter("received")}
        >
          수령 완료
        </button>
      </div>

      <div className="order-list">
        {filtered.map((order) => {
          const received = order.status === "received";

          return (
            <Link key={order.id} href={`/orders/${order.id}`} className="order-item">
              <div className="order-item-top">
                <div className="order-head-left">
                  <div className="order-name">{order.pickupPersonName}</div>
                  <div className={`status-badge ${received ? "received" : "pending"}`}>
                    {received ? "수령 완료" : "미수령"}
                  </div>
                </div>

                <div className="order-date">{order.pickupDate}</div>
              </div>

              <div className="order-items">
                {order.items.map((item) => `${item.name} ${item.quantity}개`).join(" · ")}
              </div>
            </Link>
          );
        })}

        {filtered.length === 0 && (
          <div style={{ padding: "16px 4px", fontSize: 13, color: "#7b7b7b" }}>
            검색 결과가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}