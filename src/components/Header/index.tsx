"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import styles from "./style.module.scss";

function subscribeTheme(callback: () => void) {
  window.addEventListener("storage", callback);
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === "attributes" && mutation.attributeName === "data-theme") {
        callback();
      }
    }
  });
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });

  return () => {
    window.removeEventListener("storage", callback);
    observer.disconnect();
  };
}

function getThemeSnapshot(): "light" | "dark" {
  return document.documentElement.getAttribute("data-theme") === "dark"
    ? "dark"
    : "light";
}

function getServerThemeSnapshot(): "light" | "dark" {
  return "light";
}

export default function Header() {
  const theme = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getServerThemeSnapshot
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", nextTheme);
    try {
      localStorage.setItem("theme", nextTheme);
    } catch {}
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.inner}>
          <Link href="/" className={styles.brand} aria-label="Blog Homepage">
            <span className={styles.brandText}>Saurow</span>
          </Link>
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.themeBtn}
              onClick={toggleTheme}
              aria-label={
                theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
              }
              title={
                theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
              }
            >
              {theme === "dark" ? (
                <svg
                  className={styles.themeIcon}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2" />
                  <path d="M12 20v2" />
                  <path d="m4.93 4.93 1.41 1.41" />
                  <path d="m17.66 17.66 1.41 1.41" />
                  <path d="M2 12h2" />
                  <path d="M20 12h2" />
                  <path d="m6.34 17.66-1.41 1.41" />
                  <path d="m19.07 4.93-1.41 1.41" />
                </svg>
              ) : (
                <svg
                  className={styles.themeIcon}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
              )}
            </button>

            <button
              type="button"
              className={`${styles.menuBtn} ${isMenuOpen ? styles.open : ""}`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <div
        className={`${styles.mobileOverlay} ${isMenuOpen ? styles.open : ""}`}
        onClick={closeMenu}
        aria-hidden={!isMenuOpen}
      >
        <div
          className={styles.mobileDrawer}
          onClick={(e) => e.stopPropagation()}
        >
          <Link href="/" className={styles.drawerLink} onClick={closeMenu}>
            <span>Introduction</span>
            <span>→</span>
          </Link>
          <Link
            href="/article/mask-section-transition"
            className={styles.drawerLink}
            onClick={closeMenu}
          >
            <span>Article</span>
            <span>→</span>
          </Link>
          <div className={styles.drawerDivider} />
          <Link href="/about" className={styles.drawerLink} onClick={closeMenu}>
            <span>About</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </>
  );
}