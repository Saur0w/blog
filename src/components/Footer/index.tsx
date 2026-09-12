"use client";

import Link from "next/link";
import styles from "./style.module.scss";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.leftCol}>
          <span className={styles.copyright}>
            © {new Date().getFullYear()} Saurow
          </span>
          <span className={styles.divider}>•</span>
          <span className={styles.tagline}>
            Inspired by{" "}
            <Link
              href="https://olivierlarose.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.creditLink}
            >
              Olivier Larose
            </Link>
          </span>
        </div>

        <div className={styles.links}>
          <Link
            href="https://github.com/Saur0w"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            <span>GitHub</span>
            <span>↗</span>
          </Link>
          <Link href="/about" className={styles.link}>
            About
          </Link>
          <Link
            href="https://saurow.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            <span>Portfolio</span>
            <span>↗</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
