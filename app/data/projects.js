/**
 * Homepage column mapping:
 * - name → left marquee
 * - devTime → year
 * - engine → stack
 * - genre → role
 */
export const projects = [
  {
    id: 1,
    name: "Sagobo",
    devTime: "2026",
    engine: "NEXT.JS • TYPESCRIPT",
    genre: "PRODUCT",
    image: "/projects/sagobo-1.jpg",
    gallery: [
      "/projects/sagobo-1.jpg",
      "/projects/sagobo-2.jpg",
      "/projects/sagobo-3.jpg",
      "/projects/sagobo-4.jpg",
    ],
    url: "https://sagobo.se",
    role: "Frontend Developer",
    description:
      "A live Swedish product that writes personal children's books with the child as the hero and an illustration on every page.",
    technologies: [
      "TypeScript",
      "Next.js",
      "React",
      "Tailwind",
      "MongoDB",
      "NextAuth",
      "Framer Motion",
      "GSAP",
    ],
  },
  {
    id: 2,
    name: "Job Hunter",
    devTime: "2026",
    engine: "PYTHON • API",
    genre: "OPEN SOURCE",
    image: "/projects/job-hunter.png",
    gallery: ["/projects/job-hunter.png", "/projects/job-hunter-2.png"],
    url: "https://github.com/Rafalskky/job-hunter",
    role: "Author",
    description:
      "An open-source job pipeline for the Swedish market. It reads Arbetsförmedlingen's public JobSearch API, scores ads, and writes a tailored CV and cover letter as PDFs.",
    technologies: ["Python", "API", "YAML", "LLMs", "WeasyPrint"],
  },
  {
    id: 3,
    name: "Bury Meble",
    devTime: "2024",
    engine: "NEXT.JS • FRAMER MOTION",
    genre: "FRONTEND",
    image: "/projects/burymeble-1.jpg",
    gallery: [
      "/projects/burymeble-1.jpg",
      "/projects/burymeble-2.jpg",
      "/projects/burymeble-3.jpg",
      "/projects/burymeble-4.jpg",
    ],
    url: "https://burymeble.com",
    role: "Frontend Developer",
    description:
      "A live site for custom furniture: kitchens, wardrobes, and bathrooms.",
    technologies: ["React", "Next.js", "Tailwind CSS", "Framer Motion"],
  },
  {
    id: 4,
    name: "Frisör",
    devTime: "2024",
    engine: "NEXT.JS • SHADCN / UI",
    genre: "FRONTEND",
    image: "/projects/frisor-1.jpg",
    gallery: [
      "/projects/frisor-1.jpg",
      "/projects/frisor-2.jpg",
      "/projects/frisor-3.jpg",
      "/projects/frisor-4.jpg",
      "/projects/frisor-5.jpg",
    ],
    url: "https://frisor-five.vercel.app",
    role: "Frontend Developer",
    description:
      "A hair-salon site: gallery, booking, and a dark editorial hero.",
    technologies: ["JavaScript", "Next.js", "Tailwind CSS", "React", "Shadcn/ui"],
  },
];
