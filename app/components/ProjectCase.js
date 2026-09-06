"use client";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CaseGallery from "./CaseGallery";
import { useTransition } from "./TransitionContext";

export default function ProjectCase({ project, onClose }) {
  const { setProjectOpen } = useTransition();
  const open = Boolean(project);

  useEffect(() => {
    setProjectOpen(open);
    return () => setProjectOpen(false);
  }, [open, setProjectOpen]);

  useEffect(() => {
    if (!project) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    window.lenis?.stop();
    return () => {
      window.removeEventListener("keydown", onKey);
      window.lenis?.start();
    };
  }, [project, onClose]);
  const linkLabel = project?.url?.includes("github.com") ? "GitHub" : "Live website";
  const images = project?.gallery?.length ? project.gallery : project ? [project.image] : [];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed left-0 w-full z-[80] flex flex-col md:flex-row overflow-hidden"
          style={{ top: "var(--vv-top, 0px)", height: "var(--vvh, 100svh)" }}
          role="dialog"
          aria-modal="true"
          aria-label={project.name}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1] }}
        >
          <motion.div
            initial={{ x: "-12%" }}
            animate={{ x: 0 }}
            exit={{ x: "-8%" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            className="relative w-full md:w-1/2 h-auto shrink-0 md:shrink md:h-full min-h-0 md:max-h-none bg-[#f5f5f5] text-black flex flex-col md:justify-center px-6 pt-4 pb-4 md:px-16 md:py-0 order-2 md:order-1"
          >
            <button
              type="button"
              onClick={onClose}
              className="self-start min-h-11 flex items-center mb-3 md:mb-0 md:!absolute md:!bottom-10 md:!left-12"
            >
              <span className="text-sm tracking-widest uppercase obys-link">Back</span>
            </button>

            <p className="text-[11px] tracking-[0.2em] uppercase opacity-40 mb-3 md:mb-10">
              {project.genre}
            </p>
            <h2 className="text-3xl md:text-7xl font-medium tracking-tight mb-3 md:mb-10 pr-4">
              {project.name}
            </h2>
            <p className="text-sm tracking-widest uppercase mb-1 md:mb-3">{project.engine}</p>
            <p className="text-sm tracking-widest uppercase opacity-50 mb-3 md:mb-10">{project.devTime}</p>
            <p className="max-w-md text-base leading-relaxed mb-4 md:mb-12">{project.description}</p>
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-fit"
            >
              <span className="text-sm tracking-widest uppercase obys-link">{linkLabel}</span>
            </a>
          </motion.div>

          <motion.div
            initial={{ x: "12%" }}
            animate={{ x: 0 }}
            exit={{ x: "8%" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            className="relative w-full md:w-1/2 flex-1 min-h-0 md:h-full md:flex-none bg-black order-1 md:order-2"
          >
            <CaseGallery images={images} alt={project.name} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
