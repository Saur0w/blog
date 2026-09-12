"use client";

import Link from "next/link";
import styles from "./style.module.scss";

const UPCOMING_ARTICLES = [
  {
    id: 1,
    title: "First Article Breakdown",
    tag: "ARTICLE",
    status: "Coming Soon",
    icon: "◈",
    desc: "Currently documenting the build process and creative code for upcoming interactive projects. Dropping soon.",
  },
];

export default function Landing() {
  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1 className={styles.headline}>
          Welcome to my blog — I&apos;m Saurow and here I document how I make my projects.
        </h1>

        <div className={styles.pillGroup}>
          <Link href="/article/mask-section-transition" className={styles.navPill}>
            <span>ARTICLES</span>
            <span className={styles.pillArrow}>↗</span>
          </Link>
          <Link href="/about" className={styles.navPill}>
            <span>ABOUT ME</span>
            <span className={styles.pillArrow}>↗</span>
          </Link>
          <Link
            href="https://github.com/Saur0w"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.navPill}
          >
            <span>GITHUB</span>
            <span className={styles.pillArrow}>↗</span>
          </Link>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Articles</h2>
          <Link href="/article/mask-section-transition" className={styles.seeAllLink}>
            See All →
          </Link>
        </div>

        <div className={styles.grid}>
          {UPCOMING_ARTICLES.map((article) => (
            <article key={article.id} className={styles.card}>
              <div className={styles.cardLink}>
                <div className={styles.thumbnail}>
                  <span className={styles.thumbnailIcon}>{article.icon}</span>
                  <span className={styles.thumbnailBadge}>{article.status}</span>
                </div>

                <div className={styles.metaRow}>
                  <span className={styles.cardTag}>{article.tag}</span>
                  <span>{article.status}</span>
                </div>

                <h3 className={styles.cardTitle}>{article.title}</h3>
                <p className={styles.cardDesc}>{article.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}