"use client";

import { useState } from "react";

type Props = {
  orderId: string;
  fileName: string;
};

function sanitizeFileName(name: string) {
  return name.replace(/[\\/:*?"<>|]/g, "").trim() || "pickup";
}

export default function DownloadQrButton({ orderId, fileName }: Props) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setDownloading(true);

      const response = await fetch(`/api/qr/${orderId}/image.png`, {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("QR API failed:", response.status, text);
        throw new Error(`QR 다운로드 실패 (${response.status})`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${sanitizeFileName(fileName)}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "QR 다운로드에 실패했습니다.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <button
      className="secondary-button"
      style={{ width: "100%" }}
      type="button"
      onClick={handleDownload}
      disabled={downloading}
    >
      {downloading ? "QR 다운로드 중..." : "QR 다운로드"}
    </button>
  );
}