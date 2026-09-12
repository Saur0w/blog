"use client";

import Link from "next/link";
import styles from "./style.module.scss";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.leftCol}>
          <span className={styles.copyright}>
            © {new Date().getFullYear()} Saurow
          </span>
          <span className={styles.divider}>•</span>
          <span className={styles.tagline}>
            Creative experiments & tutorials
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
          <button
            type="button"
            onClick={scrollToTop}
            className={styles.topBtn}
            aria-label="Scroll back to top"
          >
            <span>Back to top</span>
            <span>↑</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
