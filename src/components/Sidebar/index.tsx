"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./style.module.scss";

interface NavItem {
  label: string;
  href: string;
  locked?: boolean;
  active?: boolean;
}

interface NavSection {
  title: string;
  id: string;
  items: NavItem[];
}

const SIDEBAR_SECTIONS: NavSection[] = [
  {
    title: "Getting Started",
    id: "getting-started",
    items: [
      { label: "Introduction", href: "#" },
      { label: "Gallery", href: "#", active: true },
    ],
  },
  {
    title: "Courses",
    id: "courses",
    items: [
      { label: "Web Animation Course", href: "#" },
    ],
  },
  {
    title: "Article",
    id: "article",
    items: [
      { label: "Placeholder Guide using Next Image", href: "#" },
      { label: "Nextjs Page Transition Guide", href: "#" },
    ],
  },
  {
    title: "Scroll",
    id: "scroll",
    items: [
      { label: "Mask Section Transition", href: "#", locked: true },
      { label: "Background Image Parallax", href: "#" },
      { label: "Text Parallax", href: "#" },
      { label: "Sticky Footer", href: "#" },
      { label: "Perspective Section Transition", href: "#" },
      { label: "Text Along Path", href: "#" },
      { label: "SVG Path On Scroll", href: "#", locked: true },
      { label: "Horizontal Section", href: "#", locked: true },
      { label: "Zoom Parallax", href: "#" },
      { label: "Parallax Scroll", href: "#" },
      { label: "Horizontal Scroll", href: "#", locked: true },
      { label: "Text Gradient Scroll Opacity v2", href: "#" },
      { label: "Cards Parallax", href: "#" },
    ],
  },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggleSection = (id: string) => {
    setCollapsed((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav}>
        {SIDEBAR_SECTIONS.map((section) => {
          const isCollapsed = collapsed[section.id];
          return (
            <div key={section.id} className={styles.section}>
              <button
                type="button"
                className={styles.sectionHeader}
                onClick={() => toggleSection(section.id)}
                aria-expanded={!isCollapsed}
              >
                <span>{section.title}</span>
                <svg
                  className={`${styles.chevron} ${isCollapsed ? styles.collapsed : ""}`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {!isCollapsed && (
                <ul className={styles.itemList}>
                  {section.items.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className={`${styles.itemLink} ${item.active ? styles.active : ""}`}
                      >
                        <span>{item.label}</span>
                        {item.locked && (
                          <svg
                            className={styles.lockIcon}
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-label="Locked content"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}