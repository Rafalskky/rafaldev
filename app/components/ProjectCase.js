"use client";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CaseGallery from "./CaseGallery";

export default function ProjectCase({ project, onClose }) {
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

  const open = Boolean(project);
  const linkLabel = project?.url?.includes("github.com") ? "GitHub" : "Live website";
  const images = project?.gallery?.length ? project.gallery : project ? [project.image] : [];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex flex-col md:flex-row"
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
            className="relative w-full md:w-1/2 h-1/2 md:h-full bg-[#f5f5f5] text-black flex flex-col justify-center px-12 md:px-16 order-2 md:order-1"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute bottom-10 left-12 text-sm tracking-widest uppercase obys-link"
            >
              Back
            </button>
            <p className="text-[11px] tracking-[0.2em] uppercase opacity-40 mb-10">
              {project.genre}
            </p>
            <h2 className="text-5xl md:text-7xl font-medium tracking-tight mb-10">
              {project.name}
            </h2>
            <p className="text-sm tracking-widest uppercase mb-3">{project.engine}</p>
            <p className="text-sm tracking-widest uppercase opacity-50 mb-10">{project.devTime}</p>
            <p className="max-w-md text-base leading-relaxed mb-12">{project.description}</p>
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-fit text-sm tracking-widest uppercase obys-link"
            >
              {linkLabel}
            </a>
          </motion.div>

          <motion.div
            initial={{ x: "12%" }}
            animate={{ x: 0 }}
            exit={{ x: "8%" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            className="relative w-full md:w-1/2 h-1/2 md:h-full bg-black order-1 md:order-2"
          >
            <CaseGallery images={images} alt={project.name} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
