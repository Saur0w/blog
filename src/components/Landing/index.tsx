"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./style.module.scss";

const FILTERS = [
  "RECENT",
  "POPULAR",
  "SCROLL",
  "MOUSE",
  "MISC",
  "3D",
  "MENU",
  "TRANSITION",
  "SVG",
  "LANDING PAGE",
];

const PLACEHOLDER_CARDS = [
  {
    id: 1,
    title: "Mask Section Transition",
    date: "June 3, 2024",
    tag: "SCROLL",
    desc: "A website tutorial featuring a scroll animation using an SVG Mask to create a section transition.",
  },
  {
    id: 2,
    title: "Mouse Image Distortion",
    date: "June 3, 2024",
    tag: "MOUSE",
    desc: "A website animation featuring an image distortion in a curved plane, using shaders and smooth interpolation.",
  },
  {
    id: 3,
    title: "Background Image Parallax",
    date: "May 25, 2024",
    tag: "SCROLL",
    desc: "A website animation featuring a background image moving on scroll in a parallax motion with smooth easing.",
  },
  {
    id: 4,
    title: "Zoom Parallax Effect",
    date: "May 18, 2024",
    tag: "SCROLL",
    desc: "A scale-based scroll experience expanding images seamlessly as the user scrolls down the page.",
  },
  {
    id: 5,
    title: "Interactive 3D Card Hover",
    date: "May 10, 2024",
    tag: "3D",
    desc: "A reactive cursor tilt animation built with perspective CSS transformations and realistic specular light.",
  },
  {
    id: 6,
    title: "Smooth Layout Page Transition",
    date: "April 29, 2024",
    tag: "TRANSITION",
    desc: "Seamless page transitions preserving element positions and animating between routes effortlessly.",
  },
];

export default function Landing() {
  const [activeFilter, setActiveFilter] = useState("RECENT");

  return (
    <div className={styles.container}>
      {/* Filter tags bar */}
      <div className={styles.filterBar} role="tablist" aria-label="Tutorial categories">
        {FILTERS.map((filter) => (
          <button
            key={filter}
            type="button"
            className={`${styles.filterPill} ${activeFilter === filter ? styles.active : ""}`}
            onClick={() => setActiveFilter(filter)}
            role="tab"
            aria-selected={activeFilter === filter}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Heading */}
      <h1 className={styles.title}>All Tutorials</h1>

      {/* Tutorial Cards 3-column Grid */}
      <div className={styles.grid}>
        {PLACEHOLDER_CARDS.map((card) => (
          <article key={card.id} className={styles.card}>
            <Link href="/article/mask-section-transition" className={styles.cardLink}>
              <div className={styles.imagePlaceholder}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                  <circle cx="9" cy="9" r="2" />
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                </svg>
              </div>

              <div className={styles.metaRow}>
                <span>{card.date}</span>
                <span className={styles.cardTag}>{card.tag}</span>
              </div>

              <h2 className={styles.cardTitle}>{card.title}</h2>
              <p className={styles.cardDesc}>{card.desc}</p>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}