"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type DbOrder = {
  id: string;
  pickupDate: string;
  status: string;
};

export default function DashboardPage() {
  const [orders, setOrders] = useState<DbOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [updatedAt, setUpdatedAt] = useState("");

  async function loadOrders() {
    const response = await fetch("/api/import", {
      cache: "no-store",
    });
    const data = await response.json();

    if (data.ok && Array.isArray(data.items)) {
      setOrders(data.items);
      setUpdatedAt(data.updatedAt || "");

      const uniqueDates: string[] = Array.from(
        new Set(
          data.items
            .map((item: DbOrder) => item.pickupDate)
            .filter((date: string): date is string => Boolean(date))
        )
      );

      if (uniqueDates.length > 0) {
        setSelectedDate((prev) => prev || uniqueDates[0] || "");
      }
    }
  }

  async function handleRefresh() {
    try {
      setRefreshing(true);
      await fetch("/api/import", { method: "POST" });
      await loadOrders();
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => {
    let alive = true;

    async function init() {
      try {
        await loadOrders();
      } finally {
        if (alive) setLoading(false);
      }
    }

    init();

    return () => {
      alive = false;
    };
  }, []);

  const dateOptions = useMemo(() => {
  return Array.from(
    new Set(
      orders
        .map((order) => order.pickupDate)
        .filter((date: string): date is string => Boolean(date))
    )
  ).sort((a, b) => {
    const [am, ad] = a.split("/").map(Number);
    const [bm, bd] = b.split("/").map(Number);

    if (am !== bm) return am - bm;
    return ad - bd;
  });
}, [orders]);

  const filteredOrders = useMemo(() => {
    if (!selectedDate) return orders;
    return orders.filter((order) => order.pickupDate === selectedDate);
  }, [orders, selectedDate]);

  const stats = useMemo(() => {
    const total = filteredOrders.length;
    const received = filteredOrders.filter((order) => order.status === "received").length;
    const pending = total - received;

    return { total, pending, received };
  }, [filteredOrders]);

  const formattedUpdatedAt = updatedAt
    ? new Date(updatedAt).toLocaleString("ko-KR")
    : "-";

  return (
    <div>
      <h1 className="page-title">현장수령</h1>
      <p className="page-subtitle">
        현장수령일 기준으로 현재 상태를 바로 확인할 수 있습니다.
      </p>

      <div
        style={{
          marginTop: 12,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          fontSize: 12,
          color: "#7b7b7b",
        }}
      >
        <div>마지막 업데이트 {loading ? "-" : formattedUpdatedAt}</div>

        <button
          onClick={handleRefresh}
          disabled={refreshing}
          style={{
            fontSize: 12,
            color: "#7b7b7b",
            textDecoration: "underline",
            opacity: refreshing ? 0.6 : 1,
          }}
        >
          {refreshing ? "새로고침 중" : "새로고침"}
        </button>
      </div>

      <div className="filter-row" style={{ marginTop: 18, flexWrap: "wrap" }}>
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

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{selectedDate || "-"}</div>
          <div className="stat-label">선택된 수령일</div>
        </div>

        <div className="stat-card">
          <div className="stat-value">{loading ? "-" : stats.total}</div>
          <div className="stat-label">픽업 대상</div>
        </div>

        <div className="stat-card">
          <div className="stat-value">{loading ? "-" : stats.pending}</div>
          <div className="stat-label">미수령</div>
        </div>

        <div className="stat-card">
          <div className="stat-value">{loading ? "-" : stats.received}</div>
          <div className="stat-label">수령 완료</div>
        </div>
      </div>

      <div className="section">
        <Link href="/scan">
          <button className="primary-button">스캔 시작</button>
        </Link>
      </div>

      <div className="quick-grid">
        <Link href="/orders" className="quick-card">
          <div className="quick-card-title">주문 검색</div>
          <div className="quick-card-text">이름, 전화번호로 빠르게 찾기</div>
        </Link>

        <form action="/api/logout" method="post">
          <button className="quick-card" style={{ width: "100%", textAlign: "left" }}>
            <div className="quick-card-title">로그아웃</div>
            <div className="quick-card-text">현재 기기에서 세션 종료</div>
          </button>
        </form>
      </div>
    </div>
  );
}