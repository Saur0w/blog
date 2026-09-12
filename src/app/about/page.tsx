import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import styles from "./style.module.scss";

export const metadata: Metadata = {
  title: "About — Saurabh Thapliyal",
  description:
    "Creative developer based in Uttarakhand, India specializing in Next.js, GSAP, WebGL, Three.js, and interactive digital experiences.",
};

export default function About() {
  return (
    <div className={styles.container}>
      <header className={styles.hero}>
        <span className={styles.kicker}>ABOUT</span>
        <h1 className={styles.headline}>
          Saurabh Thapliyal
        </h1>
        <p className={styles.intro}>
          Creative developer from Uttarakhand, India. I build interactive,
          motion-driven web experiences with a focus on WebGL, shaders, and
          smooth scroll animations.
        </p>

        <div className={styles.pillGroup}>
          <Link
            href="https://saurow.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.navPill}
          >
            <span>PORTFOLIO</span>
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
      </header>

      <div className={styles.grid}>
        <aside className={styles.profileCol}>
          <div className={styles.imageWrapper}>
            <Image
              src="/images/a.png"
              alt="Saurabh Thapliyal"
              width={600}
              height={600}
              className={styles.avatar}
              priority
            />
          </div>

          <div className={styles.infoCard}>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Age</span>
              <span className={styles.infoValue}>23</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Location</span>
              <span className={styles.infoValue}>Uttarakhand, India</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Focus</span>
              <span className={styles.infoValue}>Creative Dev & WebGL</span>
            </div>
          </div>
        </aside>

        <section className={styles.contentCol}>
          <div className={styles.sectionBlock}>
            <h2 className={styles.sectionHeading}>Background</h2>
            <p className={styles.bodyText}>
              I specialize in bridging design and engineering — transforming static
              concepts into fluid, interactive web experiences. My work revolves around
              physics-based motion, custom GLSL shaders, and WebGL experiments.
            </p>
            <p className={styles.bodyText}>
              Through this blog, I document my process and share in-depth breakdowns
              of how modern interactive websites are built.
            </p>
          </div>

          <div className={styles.divider} />

          <div className={styles.sectionBlock}>
            <h2 className={styles.sectionHeading}>Stack</h2>

            <div className={styles.stackGroups}>
              <div className={styles.stackCard}>
                <span className={styles.stackTitle}>Core</span>
                <div className={styles.tagList}>
                  <span className={styles.tag}>Next.js</span>
                  <span className={styles.tag}>React</span>
                  <span className={styles.tag}>TypeScript</span>
                  <span className={styles.tag}>SCSS Modules</span>
                </div>
              </div>

              <div className={styles.stackCard}>
                <span className={styles.stackTitle}>Motion</span>
                <div className={styles.tagList}>
                  <span className={styles.tag}>GSAP</span>
                  <span className={styles.tag}>ScrollTrigger</span>
                  <span className={styles.tag}>Lenis</span>
                  <span className={styles.tag}>Locomotive Scroll</span>
                </div>
              </div>

              <div className={styles.stackCard}>
                <span className={styles.stackTitle}>3D & Shaders</span>
                <div className={styles.tagList}>
                  <span className={styles.tag}>Three.js</span>
                  <span className={styles.tag}>WebGL</span>
                  <span className={styles.tag}>TSL</span>
                  <span className={styles.tag}>GLSL</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}