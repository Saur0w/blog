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
