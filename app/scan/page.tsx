"use client";

import { BrowserMultiFormatReader } from "@zxing/browser";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function ScanPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const lastTokenRef = useRef("");
  const lockedRef = useRef(false);
  const router = useRouter();
  const [message, setMessage] = useState("카메라 준비 중");

  useEffect(() => {
    let mounted = true;
    let reader: BrowserMultiFormatReader | null = null;

    async function start() {
      try {
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
          setMessage("카메라를 시작할 수 없습니다.");
          return;
        }

        videoRef.current.srcObject = stream;
        await videoRef.current.play();

        setMessage("QR을 화면 안에 맞춰 주세요.");

        reader.decodeFromVideoElement(videoRef.current, async (result) => {
          if (!result || lockedRef.current) return;

          const token = result.getText().trim();
          if (!token) return;

          if (token === lastTokenRef.current) return;
          lastTokenRef.current = token;
          lockedRef.current = true;
          setMessage("확인 중...");

          try {
            const response = await fetch(
              `/api/scan/lookup?token=${encodeURIComponent(token)}`,
              { cache: "no-store" }
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

            setMessage("등록되지 않은 QR입니다.");
            setTimeout(() => {
              lockedRef.current = false;
              setMessage("QR을 화면 안에 맞춰 주세요.");
            }, 1200);
          } catch {
            setMessage("조회 중 오류가 발생했습니다.");
            setTimeout(() => {
              lockedRef.current = false;
              setMessage("QR을 화면 안에 맞춰 주세요.");
            }, 1200);
          }
        });
      } catch {
        setMessage("카메라에 접근할 수 없습니다.");
      }
    }

    start();

    return () => {
      mounted = false;
      lockedRef.current = true;
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;

      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [router]);

  return (
    <div className="scan-shell">

      <div className="camera-card">
        <video ref={videoRef} className="camera-video" muted playsInline />
        <div className="camera-guide" />
        <div className="camera-text">{message}</div>
      </div>
    </div>
  );
}