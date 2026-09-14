"use client";

import Image from "next/image";
import Link from "next/link";
import { ARTICLES } from "@/lib/articles";
import styles from "./style.module.scss";

export default function Landing() {
  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1 className={styles.headline}>
          Welcome to my blog — I&apos;m Saurow and here I document how I make my projects.
        </h1>

        <div className={styles.pillGroup}>
          <Link href="/article" className={styles.navPill}>
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
          <Link href="/article" className={styles.seeAllLink}>
            See All →
          </Link>
        </div>

        <div className={styles.grid}>
          {ARTICLES.map((article) => {
            if (article.isPublished) {
              return (
                <article key={article.slug} className={styles.card}>
                  <Link
                    href={`/article/${article.slug}`}
                    className={styles.cardLink}
                  >
                    <div className={styles.imageThumbnail}>
                      <Image
                        src={article.image}
                        alt={article.imageAlt}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1150px) 50vw, 33vw"
                        className={styles.cardImg}
                        priority
                      />
                      <span className={styles.badgeOverlay}>
                        {article.status}
                      </span>
                    </div>

                    <div className={styles.metaRow}>
                      <span className={styles.cardTag}>{article.kicker}</span>
                      <span>{article.readTime}</span>
                    </div>

                    <h3 className={styles.cardTitle}>{article.title}</h3>
                    <p className={styles.cardDesc}>{article.excerpt}</p>
                  </Link>
                </article>
              );
            }

            return (
              <article key={article.slug} className={styles.card}>
                <div className={styles.cardLink}>
                  <div className={styles.thumbnail}>
                    <span className={styles.thumbnailIcon}>{article.icon}</span>
                    <span className={styles.thumbnailBadge}>{article.status}</span>
                  </div>

                  <div className={styles.metaRow}>
                    <span className={styles.cardTag}>{article.kicker}</span>
                    <span>{article.status}</span>
                  </div>

                  <h3 className={styles.cardTitle}>{article.title}</h3>
                  <p className={styles.cardDesc}>{article.excerpt}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}