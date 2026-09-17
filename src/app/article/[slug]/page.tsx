import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticleBySlug } from "@/lib/articles";
import styles from "./style.module.scss";

type PageProps = {
  params: Promise<{ slug: string }>;
};

const FOLDER_STRUCTURE = `reel-flux/
└── src/
    ├── app/
    │   ├── layout.tsx         # Root layout & global styles
    │   ├── page.tsx           # Entry page mounting Landing
    │   └── page.module.css
    ├── components/
    │   └── Landing/
    │       ├── index.tsx      # DOM wrapper, Lenis mounting & UI overlays
    │       ├── scene.tsx      # Three.js WebGPURenderer initialization
    │       ├── mesh.tsx       # Infinite modulo loop & responsive plane mesh
    │       └── style.module.scss
    ├── hooks/
    │   └── useScroll.ts       # Lenis virtual scroll & zero-overhead state store
    └── lib/
        ├── Shader/
        │   └── index.ts       # Procedural TSL vertex & color node graphs
        └── data.ts            # Photographic assets & texture image paths`;

const MODULO_CODE = `// Symmetrical double-modulo wrapping centered on screen
const offset = (i - total / 2) * stride - scrollX;
mesh.position.x = ((((offset + half) % totalWidth) + totalWidth) % totalWidth) - half;`;

const SHADER_NODE_CODE = `// Procedural wave & aerodynamic torsion via Three.js TSL
const wavePhase = worldX.mul(uWaveFreq);
const dynY = sin(wavePhase).mul(uVelocity).mul(uAmpY);
const dynZ = cos(wavePhase).mul(uVelocity).mul(uAmpZ);
const twistZ = localY.mul(sin(wavePhase)).mul(uVelocity).mul(uTwistZ);

export const reelPositionNode = positionLocal.add(vec3(0.0, dynY, dynZ.add(twistZ)));`;

const STRIDE_FOLDER_STRUCTURE = `stride/
├── src/
│   ├── app/
│   │   ├── layout.tsx             # Root layout & font definitions
│   │   ├── template.tsx           # React 19 native <ViewTransition> boundary
│   │   ├── page.tsx               # Home landing & Lenis lock sync
│   │   └── globals.css            # ::view-transition-old / ::view-transition-new
│   ├── components/
│   │   ├── Header/                # Shared luxury sticky navigation header
│   │   ├── Landing/               # Editorial showcase & interactive elements
│   │   ├── Lenis/                 # Smooth momentum scrolling provider
│   │   └── Preloader/
│   │       ├── index.tsx          # Dual-slot GSAP letter roll & exit staging
│   │       └── style.module.scss  # Overflow masking & responsive typography
│   ├── context/
│   │   └── PreloaderContext.tsx   # React context controlling ready state
│   └── hooks/
│       └── useIsMounted.ts        # SSR hydration safety guard
└── next.config.ts                 # experimental.viewTransition: true`;

const STRIDE_SLOT_MACHINE_CODE = `// Dual-element character slot tumbling with parity-driven counter-rotation
const chars = gsap.utils.toArray<HTMLSpanElement>(\`.\${styles.char}\`);

chars.forEach((char, i) => {
  const original = char.querySelector<HTMLDivElement>(\`.\${styles.originalText}\`);
  const clone = char.querySelector<HTMLDivElement>(\`.\${styles.cloneText}\`);
  if (!original || !clone) return;

  const isEven = i % 2 === 0;

  // Alternate initial offset so adjacent letters roll in opposite directions
  gsap.set(clone, {
    yPercent: isEven ? -100 : 100,
  });

  // Create infinite tumbling cycle per character
  const roll = gsap.to([original, clone], {
    repeat: LOOP_COUNT, // 8 continuous revolutions
    ease: "none",
    yPercent: isEven ? "+=100" : "-=100",
    duration: 1,
  });

  tl.add(roll, 0);
});`;

const STRIDE_SCRUB_EXIT_CODE = `// Inertial kinetic deceleration scrubbing over the linear loop
gsap.to(tl, {
  progress: 1,
  duration: 4,
  ease: "power4.out", // Exponential spin-down settling into exact brand letters
  onComplete: () => {
    const exitTl = gsap.timeline();

    // 1. Text lifts out of masked viewport bounds
    exitTl.to(headingRef.current, {
      yPercent: -110,
      duration: 0.8,
      ease: "power4.inOut",
    })
    // 2. Fullscreen cream background curtain wipes upward
    .to(preloaderRef.current, {
      yPercent: -100,
      duration: 0.5,
      ease: "power4.inOut",
      onComplete: () => {
        // Discard preloader from render tree to unblock mouse interactions
        if (preloaderRef.current) {
          preloaderRef.current.style.display = "none";
        }
        onComplete?.(); // Notify PreloaderContext to unlock Lenis scroll
      },
    }, "-=0.4");
  },
});`;

const STRIDE_LENIS_LOCK_CODE = `// src/app/page.tsx - Synchronizing preloader completion with Lenis smooth momentum scroll
export default function Home() {
  const { isReady, setIsReady } = usePreloader();

  useEffect(() => {
    const handleLenis = () => {
      const lenis = (window as unknown as { lenis?: Lenis }).lenis;
      if (!isReady) {
        document.body.style.overflow = "hidden";
        if (lenis) lenis.stop(); // Freeze momentum during preloader
      } else {
        document.body.style.overflow = "";
        if (lenis) lenis.start(); // Restore buttery smooth scroll
      }
    };

    handleLenis();
    window.addEventListener("lenis-ready", handleLenis);

    return () => {
      document.body.style.overflow = "";
      const lenis = (window as unknown as { lenis?: Lenis }).lenis;
      if (lenis) lenis.start();
      window.removeEventListener("lenis-ready", handleLenis);
    };
  }, [isReady]);

  return (
    <main className={styles.page}>
      <Preloader onComplete={() => setIsReady(true)} />
      <Landing isReady={isReady} />
    </main>
  );
}`;

const STRIDE_VIEW_TRANSITION_CONFIG = `// next.config.ts - Next.js 16 native View Transition flag
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  experimental: {
    viewTransition: true, // Integrates Next.js App Router with View Transition API
  },
};

export default nextConfig;`;

const STRIDE_TEMPLATE_CODE = `// src/app/template.tsx - React 19 ViewTransition boundary per route change
"use client";

import React, { ViewTransition } from "react";

interface TemplateProps {
  children: React.ReactNode;
}

export default function Template({ children }: TemplateProps) {
  return (
    <ViewTransition enter="page-enter" exit="page-exit">
      {children}
    </ViewTransition>
  );
}`;

const STRIDE_CSS_VIEW_TRANSITION_CODE = `/* src/app/globals.css - Pure CSS View Transition Pseudo-Elements */

/* 1. Freeze navbar in place across route transitions */
::view-transition-group(navbar) {
  animation: none;
  z-index: 100;
}

/* 2. Animate outgoing page snapshot */
::view-transition-old(.page-exit) {
  animation: 600ms cubic-bezier(0.75, 0, 0.1, 1) both page-out;
}

/* 3. Animate incoming page snapshot */
::view-transition-new(.page-enter) {
  animation: 600ms cubic-bezier(0.75, 0, 0.1, 1) both page-in;
}

@keyframes page-in {
  from {
    transform: translateY(15%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes page-out {
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(-8%);
    opacity: 0;
  }
}`;

const FOLD_FOLDER_STRUCTURE = `saurow-fold/
├── src/
│   ├── app/
│   │   ├── layout.tsx             # Root layout & dark viewport styling
│   │   └── page.tsx               # Home landing & 3D canvas viewport mount
│   ├── components/
│   │   ├── Header/                # Editorial navigation & branding
│   │   └── Landing/
│   │       ├── index.tsx          # DOM UI overlays, interactive trigger & CTA
│   │       ├── scene.tsx          # WebGPURenderer / R3F Canvas mount
│   │       ├── mesh.tsx           # Plane mesh (256 segments) & TSL material
│   │       └── style.module.scss  # Viewport layout & glassmorphic HUD
│   └── lib/
│       └── Shaders/
│           └── index.ts           # flipVertexNode, createTextureNode, TSL uniforms`;

const FOLD_VERTEX_NODE_CODE = `import {
    positionLocal,
    uv,
    vec2,
    vec3,
    vec4,
    uniform,
    texture,
    sin,
    cos,
    PI,
    length,
    smoothstep,
    select,
    float,
    frontFacing,
} from 'three/tsl';
import * as THREE from 'three';

// Uniforms
export const uBend = uniform(-0.2);
export const uPivot = uniform(0.0);
export const uCurve = uniform(0.35);
export const uMouse = uniform(new THREE.Vector2(0.5, 0.5));
export const uHover = uniform(0.0);
export const uBrightness = uniform(0.75);
export const uHeight = uniform(1.0);
export const uCoverScale = uniform(new THREE.Vector2(1.0, 1.0));

// Backface mouse Y inversion
const isBackFacingAngle = cos(uBend).lessThan(0.0);
const mouseY = select(isBackFacingAngle, float(1.0).sub(uMouse.y), uMouse.y);
const mouse = vec2(uMouse.x, mouseY);

// Cursor proximity falloff & bidirectional hover offset
const dist = length(uv().sub(mouse));
const falloff = smoothstep(0.25, 0.0, dist);
const faceDir = select(cos(uBend).greaterThanEqual(0.0), float(1.0), float(-1.0));
const hoverOffset = falloff.mul(0.2).mul(uHover).mul(faceDir);

// Mid-flight harmonic curvature
const flex = sin(uv().y.mul(PI)).mul(uCurve).mul(sin(uBend));
const initialZ = positionLocal.z.add(hoverOffset).sub(flex);

// Axial rotation relative to pivot point
const distY = positionLocal.y.sub(uPivot);
const distZ = initialZ;

const newY = uPivot.add(distY.mul(cos(uBend))).sub(distZ.mul(sin(uBend)));
const newZ = distY.mul(sin(uBend)).add(distZ.mul(cos(uBend)));

export const flipVertexNode = vec3(positionLocal.x, newY, newZ);`;

const FOLD_TEXTURE_NODE_CODE = `// Fragment shader texture node with object-fit cover and automatic backface UV flip
export const createTextureNode = (map: THREE.Texture) => {
    const centeredUv = uv().sub(vec2(0.5, 0.5));
    const coverUv = centeredUv.mul(uCoverScale).add(vec2(0.5, 0.5));
    const backUv = vec2(coverUv.x, float(1.0).sub(coverUv.y));
    const correctedUv = select(frontFacing, coverUv, backUv);
    const sampled = texture(map, correctedUv);
    return vec4(sampled.rgb.mul(uBrightness), sampled.a);
};`;

const FOLD_MESH_COMPONENT_CODE = `'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { extend, useThree, ThreeEvent, ThreeElement, useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { MeshBasicNodeMaterial } from 'three/webgpu';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import {
    flipVertexNode,
    createTextureNode,
    uBend,
    uHover,
    uMouse,
    uCoverScale,
} from '@/lib/Shaders';

extend({ MeshBasicNodeMaterial });

declare module '@react-three/fiber' {
    interface ThreeElements {
        meshBasicNodeMaterial: ThreeElement<typeof MeshBasicNodeMaterial>;
    }
}

interface TextureImage {
    naturalWidth?: number;
    naturalHeight?: number;
    videoWidth?: number;
    videoHeight?: number;
    width?: number;
    height?: number;
}

function getCardDimensions(width: number) {
    if (width <= 480) return { w: 130, h: 143 };
    if (width <= 768) return { w: 150, h: 165 };
    if (width <= 1024) return { w: 175, h: 192 };
    return { w: 200, h: 220 };
}

function getTargetScale(width: number) {
    if (width <= 480) return 2.1;
    if (width <= 768) return 2.2;
    if (width <= 1024) return 2.3;
    return 2.5;
}

export default function MeshComponent() {
    const { viewport, size } = useThree();
    const texture = useTexture('/images/a.png');
    const meshRef = useRef<THREE.Mesh>(null!);
    const matRef = useRef<MeshBasicNodeMaterial>(null!);
    const card = useMemo(() => getCardDimensions(size.width), [size.width]);
    const w = viewport.width * (card.w / (size.width || 1));
    const h = viewport.height * (card.h / (size.height || 1));

    useEffect(() => {
        if (!texture) return;
        texture.colorSpace = THREE.SRGBColorSpace;

        const img = texture.image as TextureImage | undefined;
        const imgWidth = img?.naturalWidth || img?.videoWidth || img?.width || 1254;
        const imgHeight = img?.naturalHeight || img?.videoHeight || img?.height || 1254;
        const imageAspect = imgWidth / (imgHeight || 1);
        const meshAspect = w / (h || 1);

        if (meshAspect < imageAspect) {
            uCoverScale.value.set(meshAspect / imageAspect, 1.0);
        } else {
            uCoverScale.value.set(1.0, imageAspect / meshAspect);
        }
    }, [texture, w, h]);

    const colorNode = useMemo(() => createTextureNode(texture), [texture]);

    const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
        if (!meshRef.current) return;
        if (e.uv) {
            uMouse.value.set(e.uv.x, e.uv.y);
        }
    };

    const handlePointerEnter = () => {
        document.body.style.cursor = 'pointer';
        gsap.to(uHover, {
            value: 1,
            duration: 0.4,
            ease: 'power2.out',
        });
    };

    const handlePointerLeave = () => {
        document.body.style.cursor = 'default';
        gsap.to(uHover, {
            value: 0,
            duration: 0.6,
            ease: 'power2.out',
        });
    };

    useFrame(() => {
        if (!meshRef.current) return;
        const scrollY = typeof window !== 'undefined' ? window.scrollY : 0;
        const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
        const progress = Math.min(1.5, Math.max(0, scrollY / (vh || 1)));
        meshRef.current.rotation.x = -progress * 0.15;
        meshRef.current.position.y = -progress * 0.1;
    });

    useGSAP(() => {
        if (!meshRef.current) return;

        const targetScale = getTargetScale(size.width);
        const tl = gsap.timeline({ delay: 1 });

        tl.to(meshRef.current.scale, {
            x: 0.85,
            y: 0.85,
            duration: 0.8,
            ease: 'power2.out',
        })
            .to(
                uBend,
                {
                    value: Math.PI,
                    duration: 1.8,
                    ease: 'power3.inOut',
                },
                'flip'
            )
            .to(
                meshRef.current.scale,
                {
                    x: targetScale,
                    y: targetScale,
                    duration: 1.8,
                    ease: 'power3.inOut',
                },
                'flip'
            );
    }, { scope: meshRef });

    return (
        <mesh
            ref={meshRef}
            scale={[1, 1, 1]}
            onPointerMove={handlePointerMove}
            onPointerEnter={handlePointerEnter}
            onPointerLeave={handlePointerLeave}
        >
            <planeGeometry args={[w, h, 128, 256]} />
            <meshBasicNodeMaterial
                ref={matRef}
                side={THREE.DoubleSide}
                transparent
                positionNode={flipVertexNode}
                colorNode={colorNode}
            />
        </mesh>
    );
};`;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Article Not Found",
      description: "The requested article could not be found.",
    };
  }

  return {
    title: article.title,
    description: article.excerpt,
  };
}

export default async function ArticleSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  if (slug === "reel") {
    return (
        <article className={styles.container}>
          <Link href="/article" className={styles.backLink}>
            <span>←</span> Back to Articles
          </Link>

          <header className={styles.articleHeader}>
            <div className={styles.kickerRow}>
              <span className={styles.kicker}>{article.kicker}</span>
              <span className={styles.badge}>{article.status}</span>
            </div>

            <h1 className={styles.headline}>{article.title}</h1>

            <p className={styles.subtitle}>{article.excerpt}</p>

            {(article.demoUrl || article.githubUrl) && (
              <div className={styles.actionRow}>
                {article.demoUrl && (
                  <a
                    href={article.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
                  >
                    Live Demo ↗
                  </a>
                )}
                {article.githubUrl && (
                  <a
                    href={article.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.actionBtn}
                  >
                    GitHub Repository ↗
                  </a>
                )}
              </div>
            )}

            <div className={styles.metaRow}>
              <div className={styles.authorGroup}>
                <Image
                    src="/images/a.png"
                    alt="Saurabh Thapliyal"
                    width={40}
                    height={40}
                    className={styles.authorAvatar}
                />
                <div className={styles.authorInfo}>
                  <span className={styles.authorName}>Saurabh Thapliyal</span>
                  <span className={styles.articleDate}>
                  {article.date} · {article.readTime}
                </span>
                </div>
              </div>

              <div className={styles.pillGroup}>
                {article.tags.map((tag) => (
                    <span key={tag} className={styles.techPill}>
                  {tag}
                </span>
                ))}
              </div>
            </div>
          </header>

          <figure className={styles.heroMedia}>
            <div className={styles.heroImageWrapper}>
              <Image
                  src={article.image}
                  alt={article.imageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 920px"
                  className={styles.heroImg}
                  priority
              />
            </div>
            <figcaption className={styles.caption}>
              Figure 1: Reel-Flux interactive 3D ribbon running on WebGPU with velocity-driven wave harmonics.
            </figcaption>
          </figure>

          <nav className={styles.tocCard} aria-label="Table of contents">
            <span className={styles.tocTitle}>Table of Contents</span>
            <ul className={styles.tocList}>
              <li>
                <Link href="#context" className={styles.tocLink}>
                  Context
                </Link>
              </li>
              <li>
                <Link href="#approach" className={styles.tocLink}>
                  Approach
                </Link>
              </li>
              <li>
                <Link href="#structure" className={styles.tocLink}>
                  Project Structure
                </Link>
              </li>
              <li>
                <Link href="#infinite-scrolling" className={styles.tocLink}>
                  Infinite Scrolling
                </Link>
              </li>
              <li>
                <Link href="#wave-dynamics" className={styles.tocLink}>
                  Velocity-Driven Dynamics
                </Link>
              </li>
              <li>
                <Link href="#webgpu-tsl" className={styles.tocLink}>
                  WebGPU &amp; Node Shaders (TSL)
                </Link>
              </li>
              <li>
                <Link href="#adaptive-layout" className={styles.tocLink}>
                  Adaptive Layout &amp; Performance
                </Link>
              </li>
            </ul>
          </nav>

          <div className={styles.prose}>
            <p>
              I am Saurabh Thapliyal, a creative developer building interactive digital
              experiences with WebGL and WebGPU. I developed <strong>Reel-Flux</strong>,
              an experimental 3D horizontal gallery designed to present photography
              through physical, velocity-reactive ribbon dynamics.
            </p>

            <section id="context">
              <h2>Context</h2>
              <p>
                I began by exploring how we interact with photography on the web. Most digital
                galleries rely on conventional horizontal sliders or rigid grids that feel static
                and detached from the physical qualities of film. I wanted to create an experience
                where the gallery feels alive—blending the fluidity of analog film reels with modern
                graphics technology, giving viewers an intuitive and tactile connection to each photograph.
              </p>
            </section>

            <section id="approach">
              <h2>Approach</h2>
              <p>
                The website is designed to help visitors naturally experience the atmosphere
                and rhythm of the imagery as they scroll. Rather than sliding cards linearly
                across a flat 2D plane, I treated the collection as an elastic 3D ribbon floating
                in space. To achieve this, I implemented the following approach:
              </p>
            </section>

            <section id="structure">
              <h3>Project Structure</h3>
              <p>
                The codebase is organized into lean, focused modules that decouple DOM scroll orchestration,
                GPU shader generation, and 3D rendering:
              </p>

              <div className={styles.codeContainer}>
                <div className={styles.codeHeader}>
                  <span className={styles.codeTitle}>reel-flux / directory tree</span>
                  <span className={styles.codeLang}>TREE</span>
                </div>
                <pre className={styles.codePre}>
                <code>{FOLDER_STRUCTURE}</code>
              </pre>
              </div>

              <p>
                By isolating the procedural WebGPU nodes in <code>lib/Shader/</code> and the Lenis scroll bridge
                in <code>hooks/useScroll.ts</code>, the 3D scene in <code>components/Landing/</code> remains
                purely dedicated to matrix transforms and smooth render loops.
              </p>
            </section>

            <section id="infinite-scrolling">
              <h3>Infinite Scrolling</h3>
              <p>
                I developed an infinite scrolling mechanism on the main page, allowing visitors
                to seamlessly transition from one photo to the next for a fluid and stress-free
                browsing experience. Using Lenis for smooth inertia, vertical scroll progress
                is mapped directly into horizontal ribbon flow.
              </p>
              <p>
                To keep performance locked at 120 FPS without DOM inflation, each card wraps
                symmetrically around the screen edges using a double-modulo formula:
              </p>

              <div className={styles.codeContainer}>
                <div className={styles.codeHeader}>
                  <span className={styles.codeTitle}>components/Landing/mesh.tsx</span>
                  <span className={styles.codeLang}>TS</span>
                </div>
                <pre className={styles.codePre}>
                <code>{MODULO_CODE}</code>
              </pre>
              </div>
            </section>

            <section id="wave-dynamics">
              <h3>Velocity-Driven Dynamics</h3>
              <p>
                Additionally, I designed the scrolling effect to change dynamically based on scrolling
                speed, further enhancing the sense of control. As users scroll faster, the velocity
                modulates procedural sine waves in world coordinates.
              </p>
              <p>
                Cards physically arch into depth (Z-axis), undulate vertically (Y-axis), and exhibit
                an aerodynamic torsional twist. When scrolling stops, the ribbon smoothly settles
                back into its flat resting state.
              </p>
            </section>

            <section id="webgpu-tsl">
              <h3>WebGPU &amp; Node Shaders (TSL)</h3>
              <p>
                The 3D scene is rendered using Three.js&apos;s new <code>WebGPURenderer</code> and
                composed with the Three.js Shading Language (TSL). Instead of managing raw GLSL string
                concatenations, vertex displacements and custom film-tone grading are built as modular,
                type-safe shader nodes executed entirely on the GPU:
              </p>

              <div className={styles.codeContainer}>
                <div className={styles.codeHeader}>
                  <span className={styles.codeTitle}>lib/Shader/index.ts</span>
                  <span className={styles.codeLang}>TS</span>
                </div>
                <pre className={styles.codePre}>
                <code>{SHADER_NODE_CODE}</code>
              </pre>
              </div>
            </section>

            <section id="adaptive-layout">
              <h3>Adaptive Layout &amp; Performance</h3>
              <p>
                To ensure a comfortable viewing experience across mobile and desktop displays,
                card dimensions dynamically adjust to the viewport aspect ratio. On mobile portrait
                screens, cards scale to 70% width so adjacent photos peek into frame, inviting continuous
                exploration while shared material graphs eliminate GPU pipeline hitches.
              </p>
            </section>
          </div>
          
          <section className={styles.authorCard}>
            <Image
                src="/images/a.png"
                alt="Saurabh Thapliyal"
                width={72}
                height={72}
                className={styles.authorBioAvatar}
            />
            <div className={styles.authorBioContent}>
              <span className={styles.authorBioName}>Saurabh Thapliyal</span>
              <p className={styles.authorBioText}>
                Creative developer based in Uttarakhand, India. Building interactive,
                motion-driven web experiences with a focus on WebGPU, Three.js, shaders,
                and smooth scroll architectures.
              </p>
              <div className={styles.authorLinks}>
                <a
                    href="https://saurow.vercel.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.authorLink}
                >
                  Portfolio ↗
                </a>
                <a
                    href="https://github.com/Saur0w"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.authorLink}
                >
                  GitHub ↗
                </a>
                <a
                    href="https://x.com/sauroww"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.authorLink}
                >
                  X (Twitter) ↗
                </a>
              </div>
            </div>
          </section>

          {/* Footer Navigation */}
          <div className={styles.footerNav}>
            <Link href="/article" className={styles.backLink}>
              <span>←</span> Back to All Articles
            </Link>
            <Link href="/" className={styles.backLink}>
              Home ↗
            </Link>
          </div>
        </article>
    );
  }

  if (slug === "stride") {
    return (
        <article className={styles.container}>
          <Link href="/article" className={styles.backLink}>
            <span>←</span> Back to Articles
          </Link>

          <header className={styles.articleHeader}>
            <div className={styles.kickerRow}>
              <span className={styles.kicker}>{article.kicker}</span>
              <span className={styles.badge}>{article.status}</span>
            </div>

            <h1 className={styles.headline}>{article.title}</h1>

            <p className={styles.subtitle}>{article.excerpt}</p>

            {(article.demoUrl || article.githubUrl) && (
              <div className={styles.actionRow}>
                {article.demoUrl && (
                  <a
                    href={article.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
                  >
                    Live Demo ↗
                  </a>
                )}
                {article.githubUrl && (
                  <a
                    href={article.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.actionBtn}
                  >
                    GitHub Repository ↗
                  </a>
                )}
              </div>
            )}

            <div className={styles.metaRow}>
              <div className={styles.authorGroup}>
                <Image
                    src="/images/a.png"
                    alt="Saurabh Thapliyal"
                    width={40}
                    height={40}
                    className={styles.authorAvatar}
                />
                <div className={styles.authorInfo}>
                  <span className={styles.authorName}>Saurabh Thapliyal</span>
                  <span className={styles.articleDate}>
                  {article.date} · {article.readTime}
                </span>
                </div>
              </div>

              <div className={styles.pillGroup}>
                {article.tags.map((tag) => (
                    <span key={tag} className={styles.techPill}>
                  {tag}
                </span>
                ))}
              </div>
            </div>
          </header>

          <figure className={styles.heroMedia}>
            <div className={styles.heroImageWrapper}>
              <Image
                  src={article.image}
                  alt={article.imageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 920px"
                  className={styles.heroImg}
                  priority
              />
            </div>
            <figcaption className={styles.caption}>
              Figure 1: STRIDE editorial footwear experience featuring kinetic letterform slot tumbling and React 19 native view transition routing.
            </figcaption>
          </figure>

          <nav className={styles.tocCard} aria-label="Table of contents">
            <span className={styles.tocTitle}>Table of Contents</span>
            <ul className={styles.tocList}>
              <li>
                <Link href="#context" className={styles.tocLink}>
                  Context &amp; Editorial Philosophy
                </Link>
              </li>
              <li>
                <Link href="#structure" className={styles.tocLink}>
                  Project Architecture
                </Link>
              </li>
              <li>
                <Link href="#slot-machine" className={styles.tocLink}>
                  Kinetic Character Slot Tumbling
                </Link>
              </li>
              <li>
                <Link href="#timeline-scrubbing" className={styles.tocLink}>
                  Inertial Deceleration Scrubbing (power4.out)
                </Link>
              </li>
              <li>
                <Link href="#exit-choreography" className={styles.tocLink}>
                  Exit Staging &amp; Lenis Concurrency
                </Link>
              </li>
              <li>
                <Link href="#view-transitions" className={styles.tocLink}>
                  Next.js 16 &amp; React 19 View Transitions
                </Link>
              </li>
              <li>
                <Link href="#css-pseudo-elements" className={styles.tocLink}>
                  CSS State Interpolation &amp; Navbar Isolation
                </Link>
              </li>
              <li>
                <Link href="#comparison" className={styles.tocLink}>
                  Architecture &amp; Performance Comparison
                </Link>
              </li>
            </ul>
          </nav>

          <div className={styles.prose}>
            <p>
              I am Saurabh Thapliyal, and in this breakdown I deconstruct the motion engineering
              behind <strong>STRIDE</strong>—a high-fashion footwear commerce experience designed
              with an editorial sensibility. Here, I examine how we achieved a memorable brand introduction
              with a custom kinetic typography preloader, paired with seamless, zero-layout-shift
              page navigations powered by React 19 and Next.js 16 native View Transitions.
            </p>

            <section id="context">
              <h2>Context &amp; Editorial Philosophy</h2>
              <p>
                In high-end luxury e-commerce, the first 3 seconds dictate user perception. Standard
                loading spinners or circular progress meters break the spell of haute couture, signaling
                generic technical machinery rather than bespoke craftsmanship. For <strong>STRIDE</strong>,
                the goal was to build a preloader that feels like an analog airport split-flap display or
                a luxury watchmaker&apos;s mechanical complication—tactile, rhythmic, and mesmerizing.
              </p>
              <p>
                Equally critical was the route navigation experience. Traditional Single Page Applications (SPAs)
                often suffer from abrupt DOM swaps, white flashes, or heavy JavaScript transition libraries like
                Framer Motion that bloat the client bundle and trigger re-renders across the entire tree.
                With Next.js 16 and React 19, we engineered a native, hardware-accelerated transition system
                that offloads layout interpolation entirely to the browser&apos;s compositor thread.
              </p>
            </section>

            <section id="structure">
              <h2>Project Architecture</h2>
              <p>
                To maintain a clean separation of concerns, the project isolates loading synchronization,
                view transition routing boundaries, and inertial momentum scrolling into lean, modular layers:
              </p>

              <div className={styles.codeContainer}>
                <div className={styles.codeHeader}>
                  <span className={styles.codeTitle}>stride / directory tree</span>
                  <span className={styles.codeLang}>TREE</span>
                </div>
                <pre className={styles.codePre}>
                  <code>{STRIDE_FOLDER_STRUCTURE}</code>
                </pre>
              </div>

              <p>
                The root layout mounts <code>PreloaderProvider</code> and <code>LenisProvider</code>.
                Crucially, the route transition boundary is housed in <code>template.tsx</code> rather than
                <code>layout.tsx</code>, ensuring that each page change mounts a fresh view transition snapshot.
              </p>
            </section>

            <section id="slot-machine">
              <h2>Kinetic Character Slot Tumbling</h2>
              <p>
                The wordmark <strong>&quot;STRIDE&quot;</strong> is rendered using the expressive serif typeface
                <em> Le Murmure</em>. Rather than translating the entire word as a monolithic block, each letter is
                isolated inside an individual <code>.char</code> masking slot containing two synchronized DOM elements:
                an <code>.originalText</code> node and a <code>.cloneText</code> node.
              </p>
              <p>
                To create a rich mechanical rhythm, adjacent letters alternate their tumbling direction based on
                character index parity (<code>i % 2 === 0</code>). Even columns tumble downwards, while odd columns
                tumble upwards.
              </p>

              <div className={styles.codeContainer}>
                <div className={styles.codeHeader}>
                  <span className={styles.codeTitle}>components/Preloader/index.tsx</span>
                  <span className={styles.codeLang}>TSX / GSAP</span>
                </div>
                <pre className={styles.codePre}>
                  <code>{STRIDE_SLOT_MACHINE_CODE}</code>
                </pre>
              </div>

              <div className={styles.callout}>
                <span className={styles.calloutTitle}>Why Duplicate Nodes in DOM?</span>
                <p className={styles.calloutBody}>
                  By stacking <code>.originalText</code> and <code>.cloneText</code> with <code>position: absolute</code>
                  and <code>height: 1em</code> inside an <code>overflow: hidden</code> container, translating both by
                  <code>100%</code> creates an imperceptible modulo wrap. The viewer perceives a continuous roller
                  of letters without needing thousands of DOM nodes or high-overhead canvas rendering.
                </p>
              </div>
            </section>

            <section id="timeline-scrubbing">
              <h2>Inertial Deceleration Scrubbing (power4.out)</h2>
              <p>
                A frequent pitfall in slot-machine animations is trying to time each character independently with
                easing curves. Independent eases fall out of lockstep, causing irregular spacing and jarring halts.
              </p>
              <p>
                In <strong>STRIDE</strong>, we solved this with a master scrub technique:
              </p>
              <ol>
                <li>
                  All 6 character rolls are added to a paused sub-timeline <code>tl</code> with linear progression
                  (<code>ease: &quot;none&quot;</code>) repeating 8 times.
                </li>
                <li>
                  A master tween animates the sub-timeline&apos;s <code>progress</code> property from <code>0</code> to
                  <code>1</code> over 4 seconds, driven by a heavy <code>power4.out</code> curve.
                </li>
              </ol>

              <div className={styles.codeContainer}>
                <div className={styles.codeHeader}>
                  <span className={styles.codeTitle}>components/Preloader/index.tsx — Scrubbing &amp; Exit</span>
                  <span className={styles.codeLang}>GSAP</span>
                </div>
                <pre className={styles.codePre}>
                  <code>{STRIDE_SCRUB_EXIT_CODE}</code>
                </pre>
              </div>

              <p>
                Because the sub-timeline is linear, the master tween directly sculpts the velocity profile.
                The animation begins at blisteringly high RPM, then naturally expends its kinetic energy over 4 seconds,
                gracefully clicking into the final wordmark at zero velocity.
              </p>
            </section>

            <section id="exit-choreography">
              <h2>Exit Staging &amp; Lenis Concurrency</h2>
              <p>
                Once the brand title snaps into focus, the exit choreography unmasks the landing page in two staged beats:
              </p>
              <ul>
                <li>
                  <strong>Headline Lift:</strong> The heading translates up to <code>yPercent: -110</code> with
                  <code>power4.inOut</code> over 0.8s, disappearing behind the page&apos;s top threshold.
                </li>
                <li>
                  <strong>Curtain Wipe:</strong> With a 0.4s negative stagger (<code>&quot;-=0.4&quot;</code>), the entire
                  cream background container slides up to <code>yPercent: -100</code> over 0.5s, unveiling the editorial hero.
                </li>
              </ul>

              <p>
                To prevent accidental scrolling while the preloader is executing, the landing page synchronizes
                the viewport scroll state directly with the preloader lifecycle:
              </p>

              <div className={styles.codeContainer}>
                <div className={styles.codeHeader}>
                  <span className={styles.codeTitle}>app/page.tsx — Lenis Momentum Lock</span>
                  <span className={styles.codeLang}>TSX</span>
                </div>
                <pre className={styles.codePre}>
                  <code>{STRIDE_LENIS_LOCK_CODE}</code>
                </pre>
              </div>

              <p>
                While <code>!isReady</code>, <code>lenis.stop()</code> and <code>overflow: hidden</code> guarantee that
                scroll inputs never trigger early image lazy-loading or misaligned canvas coordinates. Once completed,
                <code>lenis.start()</code> smoothly unlocks inertial momentum navigation.
              </p>
            </section>

            <section id="view-transitions">
              <h2>Next.js 16 &amp; React 19 View Transitions</h2>
              <p>
                Traditional Next.js page transitions typically require wrapping pages in AnimatePresence, which delays
                unmounting, duplicates DOM trees in memory, and causes severe layout jumping on mobile browsers.
              </p>
              <p>
                With the advent of the <strong>Navigation and View Transition API</strong>, Next.js 16 allows native
                browser snapshotting of page navigations. We enabled this feature in <code>next.config.ts</code>:
              </p>

              <div className={styles.codeContainer}>
                <div className={styles.codeHeader}>
                  <span className={styles.codeTitle}>next.config.ts</span>
                  <span className={styles.codeLang}>TS</span>
                </div>
                <pre className={styles.codePre}>
                  <code>{STRIDE_VIEW_TRANSITION_CONFIG}</code>
                </pre>
              </div>

              <p>
                In the Next.js App Router, <code>layout.tsx</code> preserves state and persists across navigations.
                To capture route changes, we wrapped our page children inside <code>src/app/template.tsx</code> using
                React 19&apos;s experimental <code>&lt;ViewTransition&gt;</code> primitive:
              </p>

              <div className={styles.codeContainer}>
                <div className={styles.codeHeader}>
                  <span className={styles.codeTitle}>src/app/template.tsx</span>
                  <span className={styles.codeLang}>TSX</span>
                </div>
                <pre className={styles.codePre}>
                  <code>{STRIDE_TEMPLATE_CODE}</code>
                </pre>
              </div>

              <div className={styles.callout}>
                <span className={styles.calloutTitle}>Why template.tsx instead of layout.tsx?</span>
                <p className={styles.calloutBody}>
                  Next.js templates instantiate a brand-new component instance whenever the URL changes, whereas
                  layouts remain static. This re-instantiation allows React 19 to demarcate the exact outgoing and
                  incoming fiber subtrees, informing the browser to invoke <code>document.startViewTransition()</code>
                  without any manual state hooks.
                </p>
              </div>
            </section>

            <section id="css-pseudo-elements">
              <h2>CSS State Interpolation &amp; Navbar Isolation</h2>
              <p>
                Once the browser captures the outgoing and incoming snapshots, it constructs a temporary pseudo-element tree:
                <code>::view-transition-old</code> and <code>::view-transition-new</code>.
              </p>
              <p>
                In <code>src/app/globals.css</code>, we defined custom cinematic animations and preserved the brand navigation:
              </p>

              <div className={styles.codeContainer}>
                <div className={styles.codeHeader}>
                  <span className={styles.codeTitle}>src/app/globals.css</span>
                  <span className={styles.codeLang}>CSS</span>
                </div>
                <pre className={styles.codePre}>
                  <code>{STRIDE_CSS_VIEW_TRANSITION_CODE}</code>
                </pre>
              </div>

              <p>
                Two details make this transition exceptionally polished:
              </p>
              <ul>
                <li>
                  <strong>Navbar Isolation:</strong> By declaring <code>::view-transition-group(navbar) &#123; animation: none; z-index: 100; &#125;</code>,
                  the sticky header is excluded from page cross-fades and remains rock-solid while the editorial content glides underneath.
                </li>
                <li>
                  <strong>Asymmetric Timing:</strong> The outgoing page fades out and retracts slightly upwards (<code>translateY(-8%)</code>),
                  while the incoming page glides in from <code>translateY(15%)</code> using a high-tension cubic bezier
                  (<code>cubic-bezier(0.75, 0, 0.1, 1)</code>).
                </li>
              </ul>
            </section>

            <section id="comparison">
              <h2>Architecture &amp; Performance Comparison</h2>
              <p>
                Migrating from traditional JS transition wrappers to Native View Transitions yields dramatic performance
                and maintainability dividends:
              </p>

              <div className={styles.grid2}>
                <div className={styles.featureCard}>
                  <span className={styles.featureCardTitle}>Native View Transitions</span>
                  <p className={styles.featureCardDesc}>
                    • 0 kB client JS runtime overhead<br />
                    • GPU compositor hardware accelerated<br />
                    • No unmount delay or double-DOM memory spikes<br />
                    • Declarative CSS pseudo-element customization<br />
                    • Chrome/Edge/Safari cross-platform support
                  </p>
                </div>
                <div className={styles.featureCard}>
                  <span className={styles.featureCardTitle}>Legacy JS Page Transitions</span>
                  <p className={styles.featureCardDesc}>
                    • 35+ kB runtime payload (e.g. Framer Motion)<br />
                    • Main-thread JS animation execution<br />
                    • Unmount holding locks next page renders<br />
                    • Scroll jump &amp; layout thrashing bugs<br />
                    • Fragile wrapper nesting in App Router
                  </p>
                </div>
              </div>
            </section>
          </div>

          <section className={styles.authorCard}>
            <Image
                src="/images/a.png"
                alt="Saurabh Thapliyal"
                width={72}
                height={72}
                className={styles.authorBioAvatar}
            />
            <div className={styles.authorBioContent}>
              <span className={styles.authorBioName}>Saurabh Thapliyal</span>
              <p className={styles.authorBioText}>
                Creative developer based in Uttarakhand, India. Building interactive,
                motion-driven web experiences with a focus on WebGPU, Three.js, shaders,
                and smooth scroll architectures.
              </p>
              <div className={styles.authorLinks}>
                <a
                    href="https://saurow.vercel.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.authorLink}
                >
                  Portfolio ↗
                </a>
                <a
                    href="https://github.com/Saur0w"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.authorLink}
                >
                  GitHub ↗
                </a>
                <a
                    href="https://x.com/sauroww"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.authorLink}
                >
                  X (Twitter) ↗
                </a>
              </div>
            </div>
          </section>

          {/* Footer Navigation */}
          <div className={styles.footerNav}>
            <Link href="/article" className={styles.backLink}>
              <span>←</span> Back to All Articles
            </Link>
            <Link href="/" className={styles.backLink}>
              Home ↗
            </Link>
          </div>
        </article>
    );
  }

  if (slug === "fold") {
    return (
        <article className={styles.container}>
          <Link href="/article" className={styles.backLink}>
            <span>←</span> Back to Articles
          </Link>

          <header className={styles.articleHeader}>
            <div className={styles.kickerRow}>
              <span className={styles.kicker}>{article.kicker}</span>
              <span className={styles.badge}>{article.status}</span>
            </div>

            <h1 className={styles.headline}>{article.title}</h1>

            <p className={styles.subtitle}>{article.excerpt}</p>

            {(article.demoUrl || article.githubUrl) && (
              <div className={styles.actionRow}>
                {article.demoUrl && (
                  <a
                    href={article.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
                  >
                    Live Demo ↗
                  </a>
                )}
                {article.githubUrl && (
                  <a
                    href={article.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.actionBtn}
                  >
                    GitHub Repository ↗
                  </a>
                )}
              </div>
            )}

            <div className={styles.metaRow}>
              <div className={styles.authorGroup}>
                <Image
                    src="/images/a.png"
                    alt="Saurabh Thapliyal"
                    width={40}
                    height={40}
                    className={styles.authorAvatar}
                />
                <div className={styles.authorInfo}>
                  <span className={styles.authorName}>Saurabh Thapliyal</span>
                  <span className={styles.articleDate}>
                  {article.date} · {article.readTime}
                </span>
                </div>
              </div>

              <div className={styles.pillGroup}>
                {article.tags.map((tag) => (
                    <span key={tag} className={styles.techPill}>
                  {tag}
                </span>
                ))}
              </div>
            </div>
          </header>

          <figure className={styles.heroMedia}>
            <div className={styles.heroImageWrapper}>
              <Image
                  src={article.image}
                  alt={article.imageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 920px"
                  className={styles.heroImg}
                  priority
              />
            </div>
            <figcaption className={styles.caption}>
              Figure 1: Interactive 3D folding mesh rendered with Three.js TSL WebGPU node materials, featuring dynamic trigonometric depth curvature, pointer falloff, and bilateral UV orientation.
            </figcaption>
          </figure>

          <nav className={styles.tocCard} aria-label="Table of contents">
            <span className={styles.tocTitle}>Table of Contents</span>
            <ul className={styles.tocList}>
              <li>
                <Link href="#context" className={styles.tocLink}>
                  Context &amp; Mechanical Inspiration
                </Link>
              </li>
              <li>
                <Link href="#structure" className={styles.tocLink}>
                  Project Architecture
                </Link>
              </li>
              <li>
                <Link href="#vertex-deformation" className={styles.tocLink}>
                  Trigonometric Vertex Node Graph (flipVertexNode)
                </Link>
              </li>
              <li>
                <Link href="#curvature-dynamics" className={styles.tocLink}>
                  The Mathematics of Mid-Flight Flex
                </Link>
              </li>
              <li>
                <Link href="#backface-uv" className={styles.tocLink}>
                  Fragment Shading &amp; Backface UV Orientation
                </Link>
              </li>
              <li>
                <Link href="#pointer-dynamics" className={styles.tocLink}>
                  Interactive Pointer Tracking &amp; Backface Inversion
                </Link>
              </li>
              <li>
                <Link href="#gsap-integration" className={styles.tocLink}>
                  GSAP Timeline Choreography &amp; Mesh Subdivision
                </Link>
              </li>
              <li>
                <Link href="#comparison" className={styles.tocLink}>
                  Architectural Comparison: TSL vs. GLSL vs. CSS 3D
                </Link>
              </li>
            </ul>
          </nav>

          <div className={styles.prose}>
            <p>
              I am Saurabh Thapliyal, and in this breakdown I deconstruct the mathematics and shader
              architecture behind our <strong>3D Mesh Folding Card</strong>—an interactive experience built with
              <strong> Three.js Shading Language (TSL)</strong>, <strong>WebGPU</strong>, and <strong>React Three Fiber</strong>.
              Here, I examine how we moved beyond rigid CSS transforms to engineer an authentic paper-like folding simulation
              with dynamic trigonometric depth curvature, bilateral texture orientation, and cursor-reactive surface tension.
            </p>

            <section id="context">
              <h2>Context &amp; Mechanical Inspiration</h2>
              <p>
                In interface design, 3D card flips are commonly implemented using CSS <code>transform: rotateY(180deg)</code> or
                flat Three.js planes. While functionally adequate, rigid planar rotation feels mechanical and artificial.
                Real materials—cardstock, parchment, or laminated paper—undergo tensile strain when folded. They bend,
                bow outwards along their transverse axis, and resist instantaneous angular displacement.
              </p>
              <p>
                To replicate physical paper, we must displace the mesh&apos;s internal vertices along the Z-axis in mid-flip,
                peaking at 90 degrees before settling completely flat on the reverse face. By offloading this calculation
                entirely to GPU vertex shaders using <strong>Three.js TSL</strong>, we achieve buttery smooth 120 FPS
                deformation across high-density geometries with zero JavaScript main-thread calculation overhead.
              </p>
            </section>

            <section id="structure">
              <h2>Project Architecture</h2>
              <p>
                The component structure isolates the declarative R3F scene graph, procedural TSL uniform definitions,
                and DOM hover event dispatchers into modular layers:
              </p>

              <div className={styles.codeContainer}>
                <div className={styles.codeHeader}>
                  <span className={styles.codeTitle}>saurow-fold / directory tree</span>
                  <span className={styles.codeLang}>TREE</span>
                </div>
                <pre className={styles.codePre}>
                  <code>{FOLD_FOLDER_STRUCTURE}</code>
                </pre>
              </div>

              <p>
                The shader graph is maintained inside <code>lib/Shaders/index.ts</code> as standalone node exports.
                Because TSL nodes are pure composable JavaScript objects, they can be shared directly across materials,
                tested in isolation, and compiled natively to WGSL (WebGPU) or GLSL (WebGL) without string parsing.
              </p>
            </section>

            <section id="vertex-deformation">
              <h2>Trigonometric Vertex Node Graph (flipVertexNode)</h2>
              <p>
                The core displacement logic operates within <code>positionNode</code>, replacing standard vertex matrix
                multiplication with a custom parametric deformation pipeline:
              </p>

              <div className={styles.codeContainer}>
                <div className={styles.codeHeader}>
                  <span className={styles.codeTitle}>src/lib/Shaders/index.ts · TSL Vertex Graph</span>
                  <span className={styles.codeLang}>TSL / TS</span>
                </div>
                <pre className={styles.codePre}>
                  <code>{FOLD_VERTEX_NODE_CODE}</code>
                </pre>
              </div>

              <p>
                The vertex node computes displacement in three sequential stages:
              </p>
              <ul>
                <li>
                  <strong>Cursor Spring Offset:</strong> Calculates radial Euclidean distance from UV cursor coordinates
                  with smoothstep interpolation, displacing vertices forward along the active face normal.
                </li>
                <li>
                  <strong>Mid-Flight Flex Curvature:</strong> Injects a parabolic sine-wave Z-depth displacement that scales
                  dynamically with the folding angle (<code>uBend</code>).
                </li>
                <li>
                  <strong>Pivot Axis Rotation:</strong> Translates coordinates relative to <code>uPivot</code>, applies
                  standard 2D rotation matrix math along Y and Z, and returns the final transformed 3D vector.
                </li>
              </ul>
            </section>

            <section id="curvature-dynamics">
              <h2>The Mathematics of Mid-Flight Flex</h2>
              <p>
                The signature visual element of the fold is its organic, rubber-sheet curvature during transit.
                This is achieved through a harmonic compound trigonometric function:
              </p>

              <div className={styles.mathBox}>
                <span className={styles.mathLabel}>Trigonometric Surface Bow Formula</span>
                <div className={styles.mathFormula}>
                  flex = sin(uv.y * π) * uCurve * sin(uBend)
                </div>
              </div>

              <p>
                This equation exhibits critical physical properties:
              </p>
              <ul>
                <li>
                  <strong>Zero Boundary Displacement:</strong> At the card&apos;s top edge (<code>uv.y = 0.0</code>) and bottom edge
                  (<code>uv.y = 1.0</code>), <code>sin(uv.y * π)</code> equals <code>0.0</code>. The edges remain pinned in space,
                  preventing geometry detachment.
                </li>
                <li>
                  <strong>Cylindrical Arch Profile:</strong> At the vertical midpoint (<code>uv.y = 0.5</code>), <code>sin(0.5 * π) = 1.0</code>,
                  producing maximal outward protrusion that mimics natural elastic sheet tension.
                </li>
                <li>
                  <strong>Dynamic Angular Gating:</strong> <code>sin(uBend)</code> acts as an automatic envelope generator.
                  At rest on the front face (<code>uBend = 0</code>), <code>sin(0) = 0</code>. Mid-flip at 90 degrees
                  (<code>uBend = π/2</code>), <code>sin(π/2) = 1.0</code>, unlocking full curvature. When the fold completes
                  (<code>uBend = π</code>), <code>sin(π) = 0</code>, flattening the card completely against its destination.
                </li>
              </ul>

              <div className={styles.callout}>
                <span className={styles.calloutTitle}>Initial Angle &amp; Curvature Tuning</span>
                <p className={styles.calloutBody}>
                  The <code>uCurve</code> uniform sets the depth of the arc (configured to <code>0.35</code> for balanced physical tension).
                  Notice also that <code>uBend</code> initializes at <code>-0.2</code> rather than a completely flat <code>0.0</code>.
                  This deliberate resting offset introduces subtle 3D perspective and tactile depth the instant the page mounts.
                </p>
              </div>
            </section>

            <section id="backface-uv">
              <h2>Fragment Shading, Backface UV Orientation &amp; Object-Fit Cover</h2>
              <p>
                A notorious issue in double-sided 3D planes is <strong>UV mirroring</strong>. When rotating 180 degrees around
                the Y-axis, the viewer observes the geometric backside of the polygons. Because standard texture coordinates
                run from left-to-right on the front face, viewing the rear face reverses the horizontal axis, rendering
                text and typography backwards.
              </p>
              <p>
                Furthermore, textures loaded onto dynamically sized planes often suffer from stretching. In traditional CSS,
                we rely on <code>object-fit: cover</code>. In Three.js TSL, we solve both challenges inside a single
                <code>MeshBasicNodeMaterial</code> by combining dynamic aspect ratio scaling with the built-in <code>frontFacing</code> conditional node:
              </p>

              <div className={styles.codeContainer}>
                <div className={styles.codeHeader}>
                  <span className={styles.codeTitle}>src/lib/Shaders/index.ts · Fragment Texture Node</span>
                  <span className={styles.codeLang}>TSL / TS</span>
                </div>
                <pre className={styles.codePre}>
                  <code>{FOLD_TEXTURE_NODE_CODE}</code>
                </pre>
              </div>

              <p>
                In <code>mesh.tsx</code>, a <code>useEffect</code> listener compares the mesh aspect ratio (<code>w / h</code>) with the image natural aspect ratio (<code>imgWidth / imgHeight</code>):
              </p>
              <ul>
                <li>
                  If <code>meshAspect &lt; imageAspect</code>, we set <code>uCoverScale.value.set(meshAspect / imageAspect, 1.0)</code>.
                </li>
                <li>
                  Otherwise, we set <code>uCoverScale.value.set(1.0, imageAspect / meshAspect)</code>.
                </li>
              </ul>
              <p>
                When <code>frontFacing</code> evaluates to false on flip, <code>select()</code> effortlessly switches UV coordinates to
                the corrected back-face UV mapping (<code>vec2(coverUv.x, 1.0 - coverUv.y)</code>), multiplying sampled color by <code>uBrightness</code> (0.75) for a tailored editorial contrast.
              </p>
            </section>

            <section id="pointer-dynamics">
              <h2>Interactive Pointer Tracking &amp; Scroll Parallax</h2>
              <p>
                To make the card feel alive between folding states, we combine pointer proximity deformation with momentum scroll parallax:
              </p>

              <div className={styles.codeContainer}>
                <div className={styles.codeHeader}>
                  <span className={styles.codeTitle}>TSL Pointer Parity &amp; Falloff</span>
                  <span className={styles.codeLang}>TSL</span>
                </div>
                <pre className={styles.codePre}>
                  <code>{`// Cursor proximity falloff & bidirectional hover offset
const dist = length(uv().sub(mouse));
const falloff = smoothstep(0.25, 0.0, dist);
const faceDir = select(cos(uBend).greaterThanEqual(0.0), float(1.0), float(-1.0));
const hoverOffset = falloff.mul(0.2).mul(uHover).mul(faceDir);`}</code>
                </pre>
              </div>

              <p>
                Additionally, <code>useFrame</code> continuously samples window scroll progress:
              </p>
              <div className={styles.codeContainer}>
                <div className={styles.codeHeader}>
                  <span className={styles.codeTitle}>src/components/Landing/mesh.tsx · Scroll Parallax</span>
                  <span className={styles.codeLang}>TSX</span>
                </div>
                <pre className={styles.codePre}>
                  <code>{`useFrame(() => {
  if (!meshRef.current) return;
  const scrollY = typeof window !== 'undefined' ? window.scrollY : 0;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
  const progress = Math.min(1.5, Math.max(0, scrollY / (vh || 1)));
  meshRef.current.rotation.x = -progress * 0.15;
  meshRef.current.position.y = -progress * 0.1;
});`}</code>
                </pre>
              </div>

              <p>
                As the visitor scrolls through the viewport, the mesh tilts gently forward and shifts downward,
                creating tactile cinematic depth that synchronizes with the typography.
              </p>
            </section>

            <section id="gsap-integration">
              <h2>GSAP Timeline Choreography: Anticipation &amp; Flip Explosion</h2>
              <p>
                A convincing 3D flip animation requires dramatic timing. Rather than a linear flip, the animation employs classical Disney animation principles—specifically <strong>anticipation</strong>:
              </p>

              <div className={styles.codeContainer}>
                <div className={styles.codeHeader}>
                  <span className={styles.codeTitle}>src/components/Landing/mesh.tsx · Component &amp; Timeline</span>
                  <span className={styles.codeLang}>TSX</span>
                </div>
                <pre className={styles.codePre}>
                  <code>{FOLD_MESH_COMPONENT_CODE}</code>
                </pre>
              </div>

              <p>
                The choreography unfolds in two distinct stages:
              </p>
              <ul>
                <li>
                  <strong>1. Anticipation Recoil:</strong> Over 0.8s, the card scales down to <code>0.85</code>, compressing slightly inward like a coiled spring.
                </li>
                <li>
                  <strong>2. Simultaneous Flip &amp; Scale Surge:</strong> Using the shared <code>&apos;flip&apos;</code> timeline label, <code>uBend</code> rotates from <code>0</code> to <code>π</code> over 1.8s with <code>power3.inOut</code> easing, while the mesh scale expands outward from <code>0.85</code> to its viewport-responsive <code>targetScale</code> (up to 2.5x).
                </li>
              </ul>
              <p>
                Rendered with <code>&lt;planeGeometry args=&#123;[w, h, 128, 256]&#125; /&gt;</code> (128 horizontal x 256 vertical subdivisions), the resulting bend exhibits zero polygonal faceted seams.
              </p>
            </section>

            <section id="comparison">
              <h2>Architectural Comparison: TSL vs. GLSL vs. CSS 3D</h2>
              <p>
                Evaluating how modern WebGPU node shaders improve upon legacy graphics techniques and DOM transforms:
              </p>

              <div className={styles.grid2}>
                <div className={styles.featureCard}>
                  <span className={styles.featureCardTitle}>Three.js TSL Node System</span>
                  <p className={styles.featureCardDesc}>
                    • Native WebGPU &amp; WebGL compilation<br />
                    • Type-safe shader graphs in pure TypeScript<br />
                    • Zero runtime GLSL string parsing overhead<br />
                    • Built-in dynamic frontFacing branching<br />
                    • Uniforms animate directly via GSAP
                  </p>
                </div>

                <div className={styles.featureCard}>
                  <span className={styles.featureCardTitle}>Legacy GLSL ShaderMaterial</span>
                  <p className={styles.featureCardDesc}>
                    • Fragile raw string templates without linting<br />
                    • Requires manual dual-plane mesh hacks for text<br />
                    • WebGL 2 boilerplate &amp; no WebGPU WGSL export<br />
                    • Difficult to compose and share shader nodes
                  </p>
                </div>

                <div className={styles.featureCard}>
                  <span className={styles.featureCardTitle}>CSS 3D (transform-style)</span>
                  <p className={styles.featureCardDesc}>
                    • Rigid planar surfaces without vertex deformation<br />
                    • Zero tensile bow or paper flex dynamics<br />
                    • Layout thrashing and paint invalidation on low-end devices<br />
                    • Unnatural digital feel
                  </p>
                </div>

                <div className={styles.featureCard}>
                  <span className={styles.featureCardTitle}>Performance &amp; Frame Pacing</span>
                  <p className={styles.featureCardDesc}>
                    • Displaces 65,000+ vertices at 120 FPS<br />
                    • 0ms JavaScript frame calculation cost<br />
                    • Pure GPU compute execution<br />
                    • Responsive layout scaling across all viewports
                  </p>
                </div>
              </div>
            </section>
          </div>

          <section className={styles.authorCard}>
            <Image
                src="/images/a.png"
                alt="Saurabh Thapliyal"
                width={72}
                height={72}
                className={styles.authorBioAvatar}
            />
            <div className={styles.authorBioContent}>
              <span className={styles.authorBioName}>Saurabh Thapliyal</span>
              <p className={styles.authorBioText}>
                Creative developer based in Uttarakhand, India. Building interactive,
                motion-driven web experiences with a focus on WebGPU, Three.js, shaders,
                and smooth scroll architectures.
              </p>
              <div className={styles.authorLinks}>
                <a
                    href="https://saurow.vercel.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.authorLink}
                >
                  Portfolio ↗
                </a>
                <a
                    href="https://github.com/Saur0w"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.authorLink}
                >
                  GitHub ↗
                </a>
                <a
                    href="https://x.com/sauroww"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.authorLink}
                >
                  X (Twitter) ↗
                </a>
              </div>
            </div>
          </section>

          {/* Footer Navigation */}
          <div className={styles.footerNav}>
            <Link href="/article" className={styles.backLink}>
              <span>←</span> Back to All Articles
            </Link>
            <Link href="/" className={styles.backLink}>
              Home ↗
            </Link>
          </div>
        </article>
    );
  }

  return (
      <div className={styles.container}>
        <Link href="/article" className={styles.backLink}>
          <span>←</span> Back to Articles
        </Link>

        <div className={styles.emptyContainer}>
          <span className={styles.kicker}>{article.kicker}</span>
          <h1 className={styles.headline}>{article.title}</h1>
          <p className={styles.subtitle}>
            This breakdown is currently being documented. Check back shortly for
            the complete technical write-up.
          </p>
          <div className={styles.line} />
        </div>
      </div>
  );
}
