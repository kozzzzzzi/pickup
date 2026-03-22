"use client";

import { BrowserMultiFormatReader } from "@zxing/browser";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function ScanPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [message, setMessage] = useState("카메라 준비 중");
  const router = useRouter();

  useEffect(() => {
    let stopped = false;

    async function start() {
      try {
        const reader = new BrowserMultiFormatReader();

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } },
          audio: false,
        });

        streamRef.current = stream;

        if (!videoRef.current) {
          setMessage("카메라를 시작할 수 없습니다.");
          return;
        }

        videoRef.current.srcObject = stream;
        await videoRef.current.play();

        setMessage("QR을 화면 안에 맞춰 주세요.");

        reader.decodeFromVideoElement(videoRef.current, async (result) => {
          if (result && !stopped) {
            stopped = true;
            streamRef.current?.getTracks().forEach((track) => track.stop());

            const token = result.getText().trim();
            const response = await fetch(
              `/api/scan/lookup?token=${encodeURIComponent(token)}`
            );
            const data = await response.json();

            if (data.ok && data.orderId) {
              router.push(`/orders/${data.orderId}`);
              return;
            }

            setMessage("등록되지 않은 QR입니다.");
          }
        });
      } catch {
        setMessage("카메라에 접근할 수 없습니다.");
      }
    }

    start();

    return () => {
      stopped = true;
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, [router]);

  return (
    <div className="scan-shell">
      <h1 className="scan-title">QR 스캔</h1>

      <div className="camera-card">
        <video ref={videoRef} className="camera-video" muted playsInline />
        <div className="camera-guide" />
        <div className="camera-text">{message}</div>
      </div>
    </div>
  );
}