"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { projects } from "./data/projects";
import SmoothScroll from "./components/SmoothScroll";
import Logo from "./components/Logo";
import ProjectCase from "./components/ProjectCase";
import { useTransition } from "./components/TransitionContext";

const GAP = 24;

function measureCard() {
  const width = Math.round(Math.min(window.innerWidth * 0.22, 380));
  const height = Math.round(width * (4 / 3));
  return { width, height };
}

export default function Home() {
  const { isExiting, setShowChrome } = useTransition();
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showWebsite, setShowWebsite] = useState(false);
  const [showCarousel, setShowCarousel] = useState(false);
  const [activeProject, setActiveProject] = useState(0);
  const [openProject, setOpenProject] = useState(null);
  const [card, setCard] = useState({ width: 360, height: 480 });
  const containerRef = useRef(null);
  const assetsLoadedRef = useRef(false);
  const carouselTimerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const imageHeight = card.height + GAP;
  const totalStripHeight = projects.length * imageHeight;
  const baseOffset = totalStripHeight / 2;
  const yOffset = useTransform(scrollYProgress, [0, 1], [baseOffset, baseOffset - totalStripHeight]);
  const splitDistance = card.width / 2 + 64;

  useEffect(() => {
    const onResize = () => setCard(measureCard());
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    let loadedCount = 0;
    const totalItems = projects.length;
    const markLoaded = () => {
      loadedCount++;
      if (loadedCount >= totalItems) assetsLoadedRef.current = true;
    };

    projects.forEach((project) => {
      const img = new window.Image();
      img.src = project.image;
      img.onload = markLoaded;
      img.onerror = markLoaded;
    });
  }, []);

  // Counter runs for a minimum duration so the intro reads as a sequence even
  // when assets are cached; it parks at 99 until the images have really loaded.
  useEffect(() => {
    const isRepeatVisit = window.sessionStorage.getItem("introSeen") === "1";
    const minDuration = isRepeatVisit ? 700 : 1900;
    const start = performance.now();
    let raf;

    const tick = (now) => {
      const t = Math.min((now - start) / minDuration, 1);
      const eased = 1 - Math.pow(1 - t, 2.4);
      let next = Math.round(eased * 100);
      if (!assetsLoadedRef.current) next = Math.min(next, 99);
      setLoadingProgress(next);
      if (next < 100) {
        raf = requestAnimationFrame(tick);
      } else {
        window.sessionStorage.setItem("introSeen", "1");
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Strict intro order: counter finishes → loader fades → logo opens →
  // chrome fades in (via Logo onAnimationComplete) → strip rolls up.
  useEffect(() => {
    if (loadingProgress !== 100 || isExiting) return undefined;
    const openLogo = setTimeout(() => setIsLoaded(true), 500);
    return () => clearTimeout(openLogo);
  }, [loadingProgress, isExiting]);

  useEffect(() => () => clearTimeout(carouselTimerRef.current), []);

  useEffect(() => {
    if (!isExiting) return undefined;
    clearTimeout(carouselTimerRef.current);
    setShowCarousel(false);
    setShowWebsite(false);
    setOpenProject(null);
    setShowChrome(false);
    const closeLogo = setTimeout(() => setIsLoaded(false), 800);
    return () => clearTimeout(closeLogo);
  }, [isExiting, setShowChrome]);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      const index = Math.floor(latest * projects.length);
      const safeIndex = (index + projects.length) % projects.length;
      if (safeIndex !== activeProject) setActiveProject(safeIndex);
    });
    return () => unsubscribe();
  }, [activeProject, scrollYProgress]);

  const getVisibleTextItems = () => {
    const visibleCount = 7;
    const half = Math.floor(visibleCount / 2);
    const result = [];
    for (let i = -half; i <= half; i++) {
      const index = (activeProject + i + projects.length) % projects.length;
      result.push({ ...projects[index], offset: i });
    }
    return result;
  };

  return (
    <SmoothScroll infinite={true}>
      <main ref={containerRef} className="relative h-[1000vh]">
        <AnimatePresence>
          {showWebsite && !openProject && !isExiting && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="fixed top-[180px] left-12 z-40 w-[20%] pointer-events-none"
            >
              <div className="pointer-events-auto max-w-xs text-sm leading-relaxed text-black">
                <p className="mb-4">
                  Rafal Chorazewicz is a frontend developer in Stockholm. He ships products, Sagobo and Job Hunter, and motion-heavy interfaces.
                </p>
                <a href="mailto:rafal.chorazewicz@icloud.com" className="font-bold underline underline-offset-4">
                  rafal.chorazewicz@icloud.com
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {loadingProgress < 100 && (
            <motion.div
              exit={{ opacity: 0, y: 60 }}
              transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
              className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 text-[10vw] font-bold tracking-tighter text-black"
            >
              {loadingProgress}%
            </motion.div>
          )}
        </AnimatePresence>

        <div className="fixed inset-0 z-40 flex items-center justify-between px-12 pointer-events-none overflow-hidden">
          <div className="w-48 h-screen flex flex-col justify-center items-start relative">
            <AnimatePresence>
              {showWebsite && (
                <motion.div className="relative h-[400px] w-full flex items-center">
                  {getVisibleTextItems().map((project) => (
                    <motion.div
                      key={`${project.id}-${project.offset}`}
                      animate={{
                        opacity: 1 - Math.abs(project.offset) * 0.3,
                        y: project.offset * 40,
                        x: Math.abs(project.offset) * 10,
                        scale: 1 - Math.abs(project.offset) * 0.1,
                      }}
                      className={`absolute left-0 text-[10px] font-bold tracking-tighter uppercase whitespace-nowrap ${project.offset === 0 ? "text-black" : "text-zinc-300"}`}
                    >
                      {project.name}
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="w-20 text-[10px] font-bold text-black flex items-center justify-center">
            <AnimatePresence mode="wait">
              {showWebsite && (
                <motion.span key={activeProject} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  {projects[activeProject].devTime}
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <div style={{ width: card.width + 220 }} />

          <div className="w-40 text-[10px] font-bold text-black flex items-center justify-center text-center uppercase">
            <AnimatePresence mode="wait">
              {showWebsite && (
                <motion.span key={activeProject} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  {projects[activeProject].engine}
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <div className="w-32 text-[10px] font-bold text-black text-right flex items-center justify-end uppercase">
            <AnimatePresence mode="wait">
              {showWebsite && (
                <motion.span key={activeProject} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                  {projects[activeProject].genre}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        <Logo
          isLoaded={isLoaded}
          zIndex={35}
          hidden={Boolean(openProject)}
          splitDistance={splitDistance}
          onAnimationComplete={() => {
            if (isExiting) return;
            setShowWebsite(true);
            setShowChrome(true);
            clearTimeout(carouselTimerRef.current);
            carouselTimerRef.current = setTimeout(() => setShowCarousel(true), 450);
          }}
        />

        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          {/* The strip column is far taller than the viewport, so a plain
              translate can't hide it: clip the window shut instead and wipe
              it open from the bottom while the content slides up. */}
          <motion.div
            initial={false}
            animate={{
              clipPath: showCarousel && !isExiting ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)",
            }}
            transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] }}
            className="h-screen overflow-hidden relative flex items-center justify-center"
            style={{ width: card.width }}
          >
            <motion.div
              initial={false}
              animate={{ y: showCarousel && !isExiting ? "0vh" : "38vh" }}
              transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] }}
              className="w-full h-full flex items-center justify-center"
            >
              <motion.div style={{ y: yOffset }} className="flex flex-col items-center gap-6">
                {[...projects, ...projects, ...projects].map((project, idx) => {
                  const isActive = (idx % projects.length) === activeProject;
                  return (
                    <div
                      key={`${project.id}-${idx}`}
                      className="flex-shrink-0 relative transition-all duration-700"
                      style={{
                        width: card.width,
                        height: card.height,
                        opacity: isActive ? 1 : 0.4,
                        scale: isActive ? 1 : 0.94,
                        filter: isActive ? "grayscale(0%)" : "grayscale(100%)",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => setOpenProject(project)}
                        className="absolute inset-0 pointer-events-auto cursor-pointer text-left"
                        aria-label={`Open ${project.name}`}
                      >
                        <Image src={project.image} alt={project.name} fill sizes="380px" className="object-cover" />
                      </button>
                    </div>
                  );
                })}
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        <AnimatePresence>
          {showWebsite && !openProject && !isExiting && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.3 }} exit={{ opacity: 0 }} className="fixed bottom-12 left-1/2 -translate-x-1/2 text-[10px] font-bold tracking-[0.2em] z-50">
              SCROLL TO EXPLORE
            </motion.div>
          )}
        </AnimatePresence>

        <ProjectCase project={openProject} onClose={() => setOpenProject(null)} />
      </main>
    </SmoothScroll>
  );
}
