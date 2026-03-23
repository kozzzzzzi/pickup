"use client";

import { useState } from "react";

type Order = {
  id: string;
  pickupPersonName: string;
};

type Props = {
  orders: Order[];
};

export default function CopyAllQrLinksButton({ orders }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const base = window.location.origin;

      const text = orders
        .map(
          (order) =>
            `${order.pickupPersonName} - ${base}/api/qr/${order.id}/image.png`
        )
        .join("\n");

      await navigator.clipboard.writeText(text);

      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      alert("QR 링크 복사에 실패했습니다.");
    }
  };

  return (
    <>
      <span
        onClick={handleCopy}
        style={{
          fontSize: 12,
          color: "#666",
          cursor: "pointer",
        }}
      >
        전체 QR 링크 복사
      </span>

      {copied ? (
        <div className="top-toast">전체 QR 링크가 복사되었습니다.</div>
      ) : null}
    </>
  );
}