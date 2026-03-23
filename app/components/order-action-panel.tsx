"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  orderId: string;
  initialReceived: boolean;
};

export default function OrderActionPanel({
  orderId,
  initialReceived,
}: Props) {
  const [received, setReceived] = useState(initialReceived);
  const [pending, setPending] = useState(false);
  const [toast, setToast] = useState("");
  const router = useRouter();

  const showToast = (text: string) => {
    setToast(text);
    window.setTimeout(() => setToast(""), 1800);
  };

  const handleReceive = async () => {
    const ok = window.confirm("이 주문을 수령 완료 처리할까요?");
    if (!ok) return;

    try {
      setPending(true);

      const response = await fetch(`/api/orders/${orderId}/receive`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("수령 완료 처리에 실패했습니다.");
      }

      setReceived(true);
      showToast("수령 완료되었습니다.");
      router.refresh();
    } catch {
      alert("수령 완료 처리에 실패했습니다.");
    } finally {
      setPending(false);
    }
  };

  const handleUndo = async () => {
    const ok = window.confirm("수령 완료 처리를 취소할까요?");
    if (!ok) return;

    try {
      setPending(true);

      const response = await fetch(`/api/orders/${orderId}/undo`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("수령 완료 취소에 실패했습니다.");
      }

      setReceived(false);
      showToast("수령 완료가 취소되었습니다.");
      router.refresh();
    } catch {
      alert("수령 완료 취소에 실패했습니다.");
    } finally {
      setPending(false);
    }
  };

  return (
    <>
      {received ? (
        <button
          className="secondary-button"
          type="button"
          onClick={handleUndo}
          disabled={pending}
        >
          {pending ? "처리 중..." : "수령 완료 취소"}
        </button>
      ) : (
        <button
          className="primary-button"
          type="button"
          onClick={handleReceive}
          disabled={pending}
        >
          {pending ? "처리 중..." : "수령 완료"}
        </button>
      )}

      {toast ? <div className="top-toast">{toast}</div> : null}
    </>
  );
}