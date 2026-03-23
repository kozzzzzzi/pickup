"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/dashboard", label: "홈" },
  { href: "/scan", label: "스캔" },
  { href: "/orders", label: "주문" },
];

export default function BottomNav() {
  const pathname = usePathname();

  const activeIndex = items.findIndex((item) =>
    pathname.startsWith(item.href)
  );

  const safeIndex = activeIndex >= 0 ? activeIndex : 0;

  return (
    <nav className="bottom-nav">
      <div
        className="bottom-nav-indicator"
        style={{
          transform: `translateX(${safeIndex * 100}%)`,
        }}
      />
      {items.map((item) => {
        const active = pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`bottom-link${active ? " active" : ""}`}
          >
            <span className="bottom-link-label">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}