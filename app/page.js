"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projects } from "./data/projects";
import { logoSplitDistance, useLogo } from "./components/Logo";
import ProjectCase from "./components/ProjectCase";
import ProjectStrip from "./components/ProjectStrip";
import { useTransition } from "./components/TransitionContext";

function measureCard() {
  const w = window.innerWidth;
  let width;
  if (w < 640) width = Math.round(Math.min(w * 0.62, 260));
  else if (w < 1024) width = Math.round(Math.min(w * 0.4, 320));
  else width = Math.round(Math.min(w * 0.22, 380));
  return { width, height: Math.round(width * (4 / 3)) };
}

export default function Home() {
  const { isExiting, setShowChrome } = useTransition();
  const { isLoaded, setIsLoaded, setHidden, setZIndex, setSplitDistance, scrollProgress, completeRef } = useLogo();
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showLoader, setShowLoader] = useState(true);
  const [showWebsite, setShowWebsite] = useState(false);
  const [showCarousel, setShowCarousel] = useState(false);
  const [activeProject, setActiveProject] = useState(0);
  const [openProject, setOpenProject] = useState(null);
  const [card, setCard] = useState({ width: 360, height: 480 });
  const assetsLoadedRef = useRef(false);
  const carouselTimerRef = useRef(null);
  const isExitingRef = useRef(isExiting);
  isExitingRef.current = isExiting;

  const revealWork = () => {
    if (isExitingRef.current) return;
    setShowWebsite(true);
    setShowChrome(true);
    clearTimeout(carouselTimerRef.current);
    carouselTimerRef.current = setTimeout(() => setShowCarousel(true), 450);
  };

  useEffect(() => {
    setZIndex(35);
    scrollProgress.set(0);
    completeRef.current = revealWork;
    return () => {
      completeRef.current = null;
    };
  }, [setZIndex, scrollProgress, completeRef, setShowChrome]);

  useEffect(() => {
    if (!isLoaded || isExiting) return undefined;
    const fallback = setTimeout(revealWork, 1600);
    return () => clearTimeout(fallback);
  }, [isLoaded, isExiting]);

  useEffect(() => {
    setHidden(Boolean(openProject));
    return () => setHidden(false);
  }, [openProject, setHidden]);

  useEffect(() => {
    const onResize = () => {
      setCard(measureCard());
      setSplitDistance(logoSplitDistance(window.innerWidth));
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [setSplitDistance]);

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

  // Strict intro order: counter hits 100 and holds → loader fades → logo opens →
  // chrome fades in (via Logo onAnimationComplete) → strip rolls up.
  useEffect(() => {
    if (loadingProgress !== 100 || isExiting) return undefined;
    const hideLoader = setTimeout(() => setShowLoader(false), 520);
    const openLogo = setTimeout(() => setIsLoaded(true), 1000);
    return () => {
      clearTimeout(hideLoader);
      clearTimeout(openLogo);
    };
  }, [loadingProgress, isExiting, setIsLoaded]);

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
  }, [isExiting, setShowChrome, setIsLoaded]);

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
    <main className="relative min-h-dvh overscroll-none">
      <AnimatePresence>
        {showWebsite && !openProject && !isExiting && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="hidden lg:block fixed top-[180px] left-12 z-40 w-[20%] pointer-events-none"
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
        {showLoader && (
          <motion.div
            exit={{ opacity: 0, y: 60 }}
            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
            className="fixed bottom-10 md:bottom-12 left-1/2 -translate-x-1/2 z-50 text-[18vw] md:text-[10vw] font-bold tracking-tighter text-black tabular-nums"
          >
            {loadingProgress}%
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className="hidden lg:flex fixed left-0 w-full z-40 items-center justify-between px-12 pointer-events-none overflow-hidden"
        style={{ top: "var(--vv-top, 0px)", height: "var(--vvh, 100svh)" }}
      >
        <div className="w-48 h-full flex flex-col justify-center items-start relative">
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

      <div
        className="fixed left-0 w-full z-50 flex items-center justify-center pointer-events-none"
        style={{ top: "var(--vv-top, 0px)", height: "var(--vvh, 100svh)" }}
      >
        <motion.div
          initial={false}
          animate={{
            clipPath: showCarousel && !isExiting ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)",
          }}
          transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] }}
          className="h-full overflow-hidden relative flex items-center justify-center"
          style={{ width: card.width }}
        >
          <motion.div
            initial={false}
            animate={{ y: showCarousel && !isExiting ? "0%" : "38%" }}
            transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] }}
            className="w-full h-full flex items-center justify-center"
          >
            <ProjectStrip
              projects={projects}
              card={card}
              enabled={showCarousel && !openProject && !isExiting}
              onOpen={setOpenProject}
              onActiveChange={(idx) => setActiveProject((prev) => (prev === idx ? prev : idx))}
            />
          </motion.div>
        </motion.div>
      </div>

      <ProjectCase project={openProject} onClose={() => setOpenProject(null)} />
    </main>
  );
}
