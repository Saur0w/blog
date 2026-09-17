export interface Article {
  slug: string;
  title: string;
  kicker: string;
  excerpt: string;
  date: string;
  readTime: string;
  status: "Breakdown" | "Featured" | "Upcoming" | "Adding Soon";
  isPublished: boolean;
  image: string;
  imageAlt: string;
  tags: string[];
  icon?: string;
  demoUrl?: string;
  githubUrl?: string;
}

export const ARTICLES: Article[] = [
  {
    slug: "reel",
    title: "Reel: Wave Carousel",
    kicker: "WEBGL",
    excerpt:
      "Engineering an infinite horizontal 3D reel with velocity-driven sine wave distortion using React Three Fiber, custom vertex shaders, GSAP, and Lenis.",
    date: "Sep 2026",
    readTime: "6 min read",
    status: "Breakdown",
    isPublished: true,
    image: "/images/reel/main.png",
    imageAlt: "Infinite horizontal 3D WebGL wave reel with scroll distortion",
    tags: ["React Three Fiber", "Three.js", "TSL", "Lenis"],
    icon: "◈",
    demoUrl: "https://saurow-reel.vercel.app",
    githubUrl: "https://github.com/Saur0w/Reel-Flux",
  },
  {
    slug: "stride",
    title: "STRIDE: Kinetic Preloader & View Transitions",
    kicker: "MOTION ARCHITECTURE",
    excerpt:
      "Engineering an editorial kinetic typography preloader with GSAP slot-machine scrubbing and seamless route changes via React 19 View Transitions.",
    date: "Sep 2026",
    readTime: "7 min read",
    status: "Breakdown",
    isPublished: true,
    image: "/images/stride/tn.png",
    imageAlt: "STRIDE luxury footwear preloader and smooth view transition architecture",
    tags: ["Next.js 16", "React 19", "GSAP", "View Transitions", "Lenis"],
    icon: "✦",
    demoUrl: "https://str1de.vercel.app",
    githubUrl: "https://github.com/Saur0w/stride",
  },
  {
    slug: "fold",
    title: "Three.js (TSL): Mesh Folding",
    kicker: "WEBGPU / TSL",
    excerpt:
      "Engineering interactive 3D card folding, dynamic trigonometric depth curvature, and backface texture correction using Three.js Shading Language (TSL) and WebGPU.",
    date: "Sep 2026",
    readTime: "7 min read",
    status: "Breakdown",
    isPublished: true,
    image: "/images/fold.png",
    imageAlt: "Saurow portfolio 3D interactive mesh card folding and TSL deformation",
    tags: ["Three.js", "TSL", "WebGPU", "React Three Fiber", "GSAP"],
    icon: "❖",
    demoUrl: "https://saurow.vercel.app",
    githubUrl: "https://github.com/Saur0w",
  },
];

export function getAllArticles(): Article[] {
  return ARTICLES;
}

export function getArticleBySlug(slug: string): Article | undefined {
  return ARTICLES.find((article) => article.slug === slug);
}

export function getPublishedArticles(): Article[] {
  return ARTICLES.filter((article) => article.isPublished);
}
