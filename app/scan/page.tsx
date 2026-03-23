"use client";

import { BrowserMultiFormatReader } from "@zxing/browser";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function ScanPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const lastScanRef = useRef<{ token: string; time: number }>({
    token: "",
    time: 0,
  });
  const lockedRef = useRef(false);
  const router = useRouter();

  const [message, setMessage] = useState("QR을 화면 안에 맞춰 주세요.");
  const [toast, setToast] = useState("");

  const showToast = (text: string) => {
    setToast(text);
    window.setTimeout(() => setToast(""), 1600);
  };

  useEffect(() => {
    let mounted = true;
    let reader: BrowserMultiFormatReader | null = null;

    async function start() {
      try {
        lastScanRef.current = { token: "", time: 0 };
        lockedRef.current = false;

        reader = new BrowserMultiFormatReader();

        let stream: MediaStream;

        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: { ideal: "environment" },
              width: { ideal: 1280 },
              height: { ideal: 720 },
            },
            audio: false,
          });
        } catch {
          stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
          });
        }

        if (!mounted) return;

        streamRef.current = stream;

        if (!videoRef.current) {
          showToast("카메라를 시작할 수 없습니다.");
          return;
        }

        videoRef.current.srcObject = stream;
        await videoRef.current.play();

        setMessage("QR을 화면 안에 맞춰 주세요.");

        reader.decodeFromVideoElement(videoRef.current, async (result) => {
          if (!result || lockedRef.current) return;

          const token = result.getText().trim();
          if (!token) return;

          const now = Date.now();
          const isSameRecentToken =
            lastScanRef.current.token === token &&
            now - lastScanRef.current.time < 1500;

          if (isSameRecentToken) return;

          lastScanRef.current = { token, time: now };
          lockedRef.current = true;
          setMessage("확인 중...");

          try {
            const response = await fetch(
              `/api/scan/lookup?token=${encodeURIComponent(token)}`,
              {
                cache: "no-store",
              }
            );

            const data = await response.json();

            if (data.ok && data.orderId) {
              try {
                navigator.vibrate?.(60);
              } catch {}

              streamRef.current?.getTracks().forEach((track) => track.stop());
              router.replace(`/orders/${data.orderId}`);
              return;
            }

            showToast("등록되지 않은 QR입니다.");
            setMessage("QR을 화면 안에 맞춰 주세요.");

            window.setTimeout(() => {
              lockedRef.current = false;
              lastScanRef.current = { token: "", time: 0 };
            }, 1200);
          } catch {
            showToast("조회 중 오류가 발생했습니다.");
            setMessage("QR을 화면 안에 맞춰 주세요.");

            window.setTimeout(() => {
              lockedRef.current = false;
              lastScanRef.current = { token: "", time: 0 };
            }, 1200);
          }
        });
      } catch {
        showToast("카메라에 접근할 수 없습니다.");
      }
    }

    start();

    return () => {
      mounted = false;
      lockedRef.current = true;
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      lastScanRef.current = { token: "", time: 0 };

      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [router]);

  return (
    <div className="scan-shell">
      <h1 className="scan-title">QR 스캔</h1>
      <p className="scan-subtitle">
        구매자가 제시한 QR을 카메라 안쪽에 맞춰 주세요.
      </p>

      <div className="camera-card">
        <video ref={videoRef} className="camera-video" muted playsInline />
        <div className="camera-guide" />
        <div className="camera-text">{message}</div>
      </div>

      {toast ? <div className="top-toast">{toast}</div> : null}
    </div>
  );
}