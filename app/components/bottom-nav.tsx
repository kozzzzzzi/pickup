"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/dashboard", label: "홈" },
  { href: "/orders", label: "주문" },
  { href: "/scan", label: "스캔" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bottom-nav">
      {items.map((item) => {
        const active =
          pathname === item.href ||
          (item.href !== "/dashboard" && pathname.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`bottom-link${active ? " active" : ""}`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}