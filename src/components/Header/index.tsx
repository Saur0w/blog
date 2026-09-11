"use client";

import Link from "next/link";
import styles from "./style.module.scss";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand} aria-label="Home">
          <div className={styles.orb} />
        </Link>
        <button
          type="button"
          className={styles.menuBtn}
          aria-label="Open menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}