import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ARTICLES } from "@/lib/articles";
import styles from "./style.module.scss";

export const metadata: Metadata = {
  title: "Articles",
  description:
    "Engineering breakdowns of interactive 3D web experiments, custom GLSL shaders, and creative code by Saurabh Thapliyal.",
};

export default function ArticlesPage() {
  return (
    <div className={styles.container}>
      <header className={styles.hero}>
        <span className={styles.kicker}>ARTICLES & BREAKDOWNS</span>
        <h1 className={styles.title}>Engineering & Creative Code</h1>
        <p className={styles.desc}>
          In-depth technical deconstructions of interactive digital experiences,
          WebGL shaders, and physics-based motion architectures.
        </p>
      </header>

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
                    <span className={styles.badgeOverlay}>{article.status}</span>
                  </div>

                  <div className={styles.metaRow}>
                    <span className={styles.cardTag}>{article.kicker}</span>
                    <span>{article.readTime}</span>
                  </div>

                  <h2 className={styles.cardTitle}>{article.title}</h2>
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

                <h2 className={styles.cardTitle}>{article.title}</h2>
                <p className={styles.cardDesc}>{article.excerpt}</p>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
