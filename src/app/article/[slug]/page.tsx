import TableOfContents from "@/components/TableOfContents";
import styles from "./page.module.scss";

export default function ArticlePage() {
  return (
    <div className={styles.articleLayout}>
      <article className={styles.content}>
        <div className={styles.meta}>
          <span className={styles.date}>June 3, 2024</span>
          <span className={styles.tag}>SCROLL</span>
        </div>

        <h1 className={styles.title}>Mask Section Transition</h1>
        <p className={styles.lead}>
          A modern website tutorial featuring a scroll animation using an SVG Mask to create a smooth, curved section transition.
        </p>

        <section id="overview" className={styles.section}>
          <h2>Overview</h2>
          <p>
            In this guide, we explore how to transition between full-screen sections using SVG clipping masks and smooth scroll triggers.
          </p>
          <div className={styles.previewBox}>
            <span>Visual Demo Placeholder</span>
          </div>
        </section>

        <section id="prerequisites" className={styles.section}>
          <h2>Prerequisites</h2>
          <p>
            Basic understanding of React, CSS transform properties, and SVG paths.
          </p>
        </section>

        <section id="getting-started" className={styles.section}>
          <h2>Getting Started</h2>
          <p>
            To begin, initialize your SVG viewport and define the clip path with dynamic curve coordinates.
          </p>
        </section>

        <section id="svg-mask-setup" className={styles.section}>
          <h3>SVG Mask Setup</h3>
          <p>
            The mask uses quadratic Bézier curves that dynamically adjust tension based on scroll velocity.
          </p>
        </section>

        <section id="scroll-animation" className={styles.section}>
          <h3>Scroll Animation</h3>
          <p>
            Hooking into the scroll progress allows linear interpolation of the SVG control points.
          </p>
        </section>

        <section id="browser-support" className={styles.section}>
          <h2>Browser Support</h2>
          <p>
            SVG masks are supported across all modern evergreen browsers with hardware acceleration enabled.
          </p>
        </section>

        <section id="conclusion" className={styles.section}>
          <h2>Conclusion</h2>
          <p>
            With this technique, you can elevate traditional block layouts into fluid, interactive experiences.
          </p>
        </section>
      </article>

      {/* Right Column: Table of Contents */}
      <TableOfContents />
    </div>
  );
}
