"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./style.module.scss";

interface TocItem {
  id: string;
  label: string;
  depth?: 2 | 3;
}

interface TableOfContentsProps {
  items?: TocItem[];
  title?: string;
}

const DEFAULT_TOC_ITEMS: TocItem[] = [
  { id: "overview", label: "Overview", depth: 2 },
  { id: "prerequisites", label: "Prerequisites", depth: 2 },
  { id: "getting-started", label: "Getting Started", depth: 2 },
  { id: "svg-mask-setup", label: "SVG Mask Setup", depth: 3 },
  { id: "scroll-animation", label: "Scroll Animation", depth: 3 },
  { id: "browser-support", label: "Browser Support", depth: 2 },
  { id: "conclusion", label: "Conclusion", depth: 2 },
];

export default function TableOfContents({
  items = DEFAULT_TOC_ITEMS,
  title = "On this page",
}: TableOfContentsProps) {
  const [activeId, setActiveId] = useState("overview");

  return (
    <nav className={styles.toc} aria-label="Table of contents">
      <h2 className={styles.heading}>{title}</h2>
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.id} className={styles.item}>
            <Link
              href={`#${item.id}`}
              className={`${styles.link} ${item.depth === 3 ? styles.depth3 : ""} ${
                activeId === item.id ? styles.active : ""
              }`}
              onClick={() => setActiveId(item.id)}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
