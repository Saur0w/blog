"use client";

import Link from "next/link";
import styles from "./style.module.scss";

const UPCOMING_PROJECTS = [
  {
    id: 1,
    title: "First Project Breakdown",
    tag: "TUTORIAL",
    status: "Adding Soon",
    icon: "◈",
    desc: "Currently documenting the build process and creative code for upcoming interactive projects. Dropping soon.",
  },
  {
    id: 2,
    title: "Creative Animations & Motion",
    tag: "INTERACTIVE",
    status: "In Progress",
    icon: "✦",
    desc: "A deep dive into fluid physics-based interactions, custom easing, and smooth scroll transitions.",
  },
  {
    id: 3,
    title: "Design Systems & Modern UI",
    tag: "ARCHITECTURE",
    status: "Upcoming",
    icon: "⟡",
    desc: "Engineering responsive layouts, minimalist typography, and seamless dark mode web architecture.",
  },
];

export default function Landing() {
  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1 className={styles.headline}>
          Welcome to my blog{" "}
          <span className={styles.inlineOrb} aria-hidden="true" /> I&apos;m
          Saurow and here I document how I make my projects.
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
          <h2 className={styles.sectionTitle}>Recent Breakdowns</h2>
          <Link href="/article/mask-section-transition" className={styles.seeAllLink}>
            See All →
          </Link>
        </div>

        <div className={styles.grid}>
          {UPCOMING_PROJECTS.map((project) => (
            <article key={project.id} className={styles.card}>
              <div className={styles.cardLink}>
                <div className={styles.thumbnail}>
                  <span className={styles.thumbnailIcon}>{project.icon}</span>
                  <span className={styles.thumbnailBadge}>{project.status}</span>
                </div>

                <div className={styles.metaRow}>
                  <span className={styles.cardTag}>{project.tag}</span>
                  <span>{project.status}</span>
                </div>

                <h3 className={styles.cardTitle}>{project.title}</h3>
                <p className={styles.cardDesc}>{project.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}