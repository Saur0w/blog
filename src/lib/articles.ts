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
  }
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
