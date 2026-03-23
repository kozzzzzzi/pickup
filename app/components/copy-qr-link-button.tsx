"use client";

import { useState } from "react";

type Props = {
  orderId: string;
};

export default function CopyQrLinkButton({ orderId }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const url = `${window.location.origin}/api/qr/${orderId}/image.png`;
      await navigator.clipboard.writeText(url);

      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      alert("QR 링크 복사에 실패했습니다.");
    }
  };

  return (
    <>
      <button
        className="secondary-button"
        type="button"
        onClick={handleCopy}
        style={{ width: "100%" }}
      >
        QR 링크 복사
      </button>

      {copied ? <div className="top-toast">QR 링크가 복사되었습니다.</div> : null}
    </>
  );
}