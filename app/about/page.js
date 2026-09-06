"use client";
import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import Image from "next/image";
import SmoothScroll from "../components/SmoothScroll";
import Footer from "../components/Footer";
import { logoSplitDistance, useLogo } from "../components/Logo";
import { useTransition } from "../components/TransitionContext";
import { aboutData } from "../data/about";

const workImages = [
  { src: "/projects/sagobo-1.jpg", name: "Sagobo", year: "2026" },
  { src: "/projects/job-hunter.png", name: "Job Hunter", year: "2026" },
  { src: "/projects/burymeble-1.jpg", name: "Bury Meble", year: "2024" },
  { src: "/projects/frisor-1.jpg", name: "Frisör", year: "2024" },
];

const RevealImage = ({ src, name, year, index }) => (
  <div className={index % 2 === 1 ? "md:mt-20" : ""}>
    <div className="relative aspect-[3/4] overflow-hidden">
      <motion.div
        initial={{ scale: 1.3, y: "12%" }}
        whileInView={{ scale: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 1.2, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0"
      >
        <Image src={src} alt={name} fill sizes="(min-width: 768px) 22vw, 45vw" className="object-cover" />
      </motion.div>
    </div>
    <div className="mt-4 flex items-baseline justify-between text-[10px] font-bold tracking-[0.2em] uppercase">
      <span>{name}</span>
      <span className="opacity-40">{year}</span>
    </div>
  </div>
);

const SplitText = ({ children, className = "", delay = 0 }) => {
  const text =
    typeof children === "string"
      ? children
      : Array.isArray(children)
        ? children.join("")
        : children == null
          ? ""
          : String(children);
  if (!text) return null;
  return (
    <div className={`${className} flex flex-wrap row-gap-0 column-gap-[0.25em]`}>
      {text.split(" ").map((word, j) => (
        <span key={j} className="inline-block overflow-hidden pb-[0.1em] mr-[0.25em]">
          <motion.span
            initial={{ opacity: 0, y: "100%" }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: delay + j * 0.02, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </div>
  );
};

export default function About() {
  const { isExiting, setShowChrome } = useTransition();
  const { isLoaded, setIsLoaded, setZIndex, setSplitDistance, scrollProgress } = useLogo();
  const containerRef = useRef(null);
  const [showBio, setShowBio] = useState(true);
  const { scrollY } = useScroll();

  useEffect(() => {
    setZIndex(20);
    const onResize = () => setSplitDistance(logoSplitDistance(window.innerWidth));
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [setZIndex, setSplitDistance]);

  useEffect(() => {
    const open = setTimeout(() => {
      setIsLoaded(true);
      setShowChrome(true);
    }, 180);
    return () => clearTimeout(open);
  }, [setShowChrome, setIsLoaded]);

  useEffect(() => {
    if (!isExiting) return undefined;
    setShowChrome(false);
    const closeLogo = setTimeout(() => setIsLoaded(false), 400);
    return () => clearTimeout(closeLogo);
  }, [isExiting, setShowChrome, setIsLoaded]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 100) {
      if (showBio) setShowBio(false);
    } else {
      if (!showBio) setShowBio(true);
    }
  });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    if (isExiting) return undefined;
    scrollProgress.set(scrollYProgress.get());
    const unsub = scrollYProgress.on("change", (v) => scrollProgress.set(v));
    return () => unsub();
  }, [scrollYProgress, scrollProgress, isExiting]);

  return (
    <SmoothScroll infinite={false}>
      <main ref={containerRef} className="relative">
        <AnimatePresence>
          {showBio && !isExiting && isLoaded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="hidden lg:block fixed top-[180px] left-12 z-50 w-[25%] pointer-events-none"
            >
              <div className="pointer-events-auto max-w-xs text-sm leading-relaxed text-black">
                <p className="mb-4">{aboutData.aboutMe}</p>
                <a href={`mailto:${aboutData.contact.email}`} className="font-bold underline underline-offset-4">
                  {aboutData.contact.email}
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded && !isExiting ? 1 : 0 }}
          transition={{ duration: 1.2, delay: isLoaded ? 0.25 : 0, ease: [0.76, 0, 0.24, 1] }}
          className="relative pt-[80dvh]"
        >
          <section className="px-6 md:px-12 py-32 mx-auto relative z-10">
            <div className="grid grid-cols-12 relative">
              <div className="col-span-12 md:col-span-9">
                <SplitText className="obys-text-large font-black uppercase leading-[0.9] relative z-30">
                  I&apos;m Rafal, a frontend developer in Stockholm. I ship products, not just interfaces.
                </SplitText>
              </div>
            </div>
          </section>

          <section className="px-6 md:px-12 py-32 mx-auto border-t border-black/5 relative z-10">
            <div className="grid grid-cols-12 relative">
              <div className="col-span-12 md:col-start-4 md:col-span-9 text-right md:text-left">
                <SplitText className="obys-text-large relative z-30">
                  Two solo products end to end: Sagobo, a personalized children&apos;s book platform, and Job Hunter, an open-source job pipeline. Game programming at BTH feeds the motion.
                </SplitText>
                <p className="mt-8 text-xl opacity-40 max-w-xl md:ml-0 ml-auto relative z-30">
                  React, Next.js, TypeScript. Accessibility and user experience first.
                </p>
              </div>
            </div>
          </section>

          <section className="px-6 md:px-12 pb-32 mx-auto relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {workImages.map((img, i) => (
                <RevealImage key={img.name} {...img} index={i} />
              ))}
            </div>
          </section>

          <section className="px-6 md:px-12 py-64 bg-black text-white overflow-hidden relative z-100">
            <div className="mx-auto relative">
              <div className="relative z-50">
                <ul className="max-w-3xl">
                  {aboutData.jobs.map((job) => (
                    <li key={`${job.company}-${job.period}`} className="group border-b border-white/15">
                      <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2 py-8 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-4">
                        <span className="text-2xl md:text-4xl font-black uppercase tracking-tight transition-opacity duration-500 opacity-90 group-hover:opacity-100">
                          {job.company}
                        </span>
                        <span className="text-sm tracking-widest uppercase opacity-60 transition-opacity duration-500 group-hover:opacity-100">
                          {job.role === job.company ? job.period : `${job.role} · ${job.period}`}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section className="px-6 md:px-12 py-48 mx-auto relative z-10">
            <div className="relative">
              <SplitText className="obys-text-large font-bold mb-8 relative z-30">
                {aboutData.education.program} at {aboutData.education.school}.
              </SplitText>
              <p className="text-xl opacity-40">{aboutData.education.period}</p>
            </div>
          </section>

          <Footer />
        </motion.div>
      </main>
    </SmoothScroll>
  );
}
