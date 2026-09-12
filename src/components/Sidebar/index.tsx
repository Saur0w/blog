"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./style.module.scss";

const NAV_ITEMS = [
  { label: "Introduction", href: "/" },
  { label: "Article", href: "/article/mask-section-transition" },
  { label: "About", href: "/about" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav}>
        <ul className={styles.itemList}>
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith("/article") && item.label === "Article"
                ? true
                : pathname === item.href;

            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={`${styles.itemLink} ${isActive ? styles.active : ""}`}
                >
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}