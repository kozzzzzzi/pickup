import "./globals.css";
import Link from "next/link";
import { ReactNode } from "react";
import BottomNav from "./components/bottom-nav";

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <div className="app-shell">

          <main className="app-main">{children}</main>

          <BottomNav />
        </div>
      </body>
    </html>
  );
}