"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import CopyAllQrLinksButton from "@/app/components/copy-all-qr-links-button";

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
  const [selectedDate, setSelectedDate] = useState<string>("all");
  const [sortType, setSortType] = useState<"date" | "name">("date");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const dateOptions = useMemo(() => {
    return Array.from(new Set(orders.map((o) => o.pickupDate).filter(Boolean))).sort((a, b) => {
      const [am, ad] = a.split("/").map(Number);
      const [bm, bd] = b.split("/").map(Number);
      if (am !== bm) return am - bm;
      return ad - bd;
    });
  }, [orders]);

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

      const matchesDate =
        selectedDate === "all" || order.pickupDate === selectedDate;

      return matchesQuery && matchesStatus && matchesDate;
    });
  }, [orders, query, statusFilter, selectedDate]);

  const sortedOrders = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (sortType === "name") {
        return a.pickupPersonName.localeCompare(b.pickupPersonName, "ko");
      }

      const [am, ad] = a.pickupDate.split("/").map(Number);
      const [bm, bd] = b.pickupDate.split("/").map(Number);

      if (am !== bm) return am - bm;
      if (ad !== bd) return ad - bd;

      return a.pickupPersonName.localeCompare(b.pickupPersonName, "ko");
    });
  }, [filtered, sortType]);

  const statusLabel =
    statusFilter === "all"
      ? "전체"
      : statusFilter === "pending"
        ? "미수령"
        : "수령 완료";

  const sortLabel = sortType === "date" ? "날짜순" : "이름순";
  const dateLabel = selectedDate === "all" ? "전체 날짜" : selectedDate;

  return (
    <div>
      <h1 className="page-title">주문</h1>
      <p className="page-subtitle">
        이름이나 전화번호로 빠르게 찾을 수 있습니다.
      </p>

      <div className="orders-toolbar">
        <div className="orders-toolbar-row orders-toolbar-row--actions">
          <a href="/api/qr/all" className="toolbar-link-action">
            전체 QR 다운로드
          </a>

          <span className="toolbar-link-separator" aria-hidden="true">·</span>

          <CopyAllQrLinksButton
            orders={orders.map((o) => ({
              id: o.id,
              pickupPersonName: o.pickupPersonName,
            }))}
          />
        </div>

        <div className="search-wrap orders-search-wrap">
          <input
            className="search-box"
            placeholder="이름 또는 전화번호 검색"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            marginTop: 2,
          }}
        >
          <div
            style={{
              fontSize: 12,
              color: "#7b7b7b",
              lineHeight: 1.4,
              minWidth: 0,
            }}
          >
            {statusLabel} · {dateLabel} · {sortLabel}
          </div>

          <button
            type="button"
            onClick={() => setFiltersOpen((prev) => !prev)}
            style={{
              fontSize: 12,
              color: "#666",
              background: "transparent",
              whiteSpace: "nowrap",
            }}
          >
            {filtersOpen ? "필터 닫기" : "필터/정렬"}
          </button>
        </div>

        {filtersOpen ? (
          <div
            style={{
              display: "grid",
              gap: 12,
              marginTop: 2,
              padding: 14,
              borderRadius: 16,
              background: "#FAFAF9",
            }}
          >
            <div className="orders-toolbar-group">
              <div className="orders-toolbar-label">상태</div>
              <div className="filter-row orders-filter-row orders-filter-row--compact">
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
            </div>

            <div className="orders-toolbar-group">
              <div className="orders-toolbar-label">수령일</div>
              <div className="filter-row orders-filter-row orders-filter-row--compact orders-filter-row--wrap">
                <button
                  className={`filter-chip${selectedDate === "all" ? " active" : ""}`}
                  onClick={() => setSelectedDate("all")}
                >
                  전체
                </button>

                {dateOptions.map((date) => (
                  <button
                    key={date}
                    className={`filter-chip${selectedDate === date ? " active" : ""}`}
                    onClick={() => setSelectedDate(date)}
                  >
                    {date}
                  </button>
                ))}
              </div>
            </div>

            <div className="orders-toolbar-group">
              <div className="orders-toolbar-label">정렬</div>
              <div className="filter-row orders-filter-row orders-filter-row--compact">
                <button
                  className={`filter-chip${sortType === "date" ? " active" : ""}`}
                  onClick={() => setSortType("date")}
                >
                  날짜순
                </button>

                <button
                  className={`filter-chip${sortType === "name" ? " active" : ""}`}
                  onClick={() => setSortType("name")}
                >
                  이름순
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div className="order-list">
        {sortedOrders.map((order) => {
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

        {sortedOrders.length === 0 && (
          <div style={{ padding: "16px 4px", fontSize: 13, color: "#7b7b7b" }}>
            검색 결과가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}