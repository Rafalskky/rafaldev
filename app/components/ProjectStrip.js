"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, animate } from "framer-motion";
import Image from "next/image";

function wrapDelta(value, index, count) {
  let d = index - value;
  const half = count / 2;
  while (d > half) d -= count;
  while (d < -half) d += count;
  return d;
}

const STEP = 108;

function ProjectSlide({ project, index, count, smooth, card, onOpen }) {
  const d = useTransform(smooth, (v) => wrapDelta(v, index, count));
  const y = useTransform(d, (v) => `calc(-50% + ${v * STEP}%)`);
  const scale = useTransform(d, (v) => 1 - Math.min(Math.abs(v) * 0.08, 0.24));
  const opacity = useTransform(d, (v) => {
    const a = Math.abs(v);
    if (a > 1.6) return 0;
    return a < 0.5 ? 1 : Math.max(0, 1 - (a - 0.5) * 0.9);
  });
  const grayscale = useTransform(d, (v) => `grayscale(${Math.min(Math.abs(v) * 1.4, 1) * 100}%)`);
  const zIndex = useTransform(d, (v) => Math.round(20 - Math.abs(v) * 5));

  return (
    <motion.div
      className="absolute left-1/2 top-1/2"
      style={{
        x: "-50%",
        y,
        scale,
        opacity,
        zIndex,
        filter: grayscale,
        width: card.width,
        height: card.height,
      }}
    >
      <button
        type="button"
        onClick={() => onOpen(project)}
        className="relative block w-full h-full cursor-pointer overflow-hidden pointer-events-auto text-left"
        aria-label={`Open ${project.name}`}
      >
        <Image
          src={project.image}
          alt={project.name}
          fill
          sizes="(max-width: 1023px) 62vw, 380px"
          className="object-cover"
        />
      </button>
    </motion.div>
  );
}

export default function ProjectStrip({ projects, card, enabled, onOpen, onActiveChange }) {
  const count = projects.length;
  const progress = useMotionValue(0);
  const smooth = useSpring(progress, { stiffness: 160, damping: 28, mass: 0.9 });
  const snapTimer = useRef(null);

  const onActiveChangeRef = useRef(onActiveChange);
  onActiveChangeRef.current = onActiveChange;

  useEffect(() => {
    const unsubscribe = smooth.on("change", (v) => {
      const idx = ((Math.round(v) % count) + count) % count;
      onActiveChangeRef.current(idx);
    });
    return () => unsubscribe();
  }, [smooth, count]);

  const goTo = useCallback(
    (target) => {
      clearTimeout(snapTimer.current);
      animate(progress, target, { duration: 0.65, ease: [0.76, 0, 0.24, 1] });
    },
    [progress]
  );

  const step = useCallback(
    (dir) => goTo(Math.round(progress.get()) + dir),
    [goTo, progress]
  );

  useEffect(() => {
    if (!enabled || count < 2) return undefined;

    const scheduleSnap = () => {
      clearTimeout(snapTimer.current);
      snapTimer.current = setTimeout(() => {
        animate(progress, Math.round(progress.get()), {
          duration: 0.5,
          ease: [0.76, 0, 0.24, 1],
        });
      }, 140);
    };

    const onWheel = (e) => {
      e.preventDefault();
      progress.stop();
      progress.set(progress.get() + e.deltaY * 0.0022);
      scheduleSnap();
    };

    let lastY = null;
    const onTouchStart = (e) => {
      lastY = e.touches[0].clientY;
    };
    const onTouchMove = (e) => {
      if (lastY == null) return;
      e.preventDefault();
      const y = e.touches[0].clientY;
      progress.stop();
      progress.set(progress.get() + (lastY - y) * 0.014);
      lastY = y;
      scheduleSnap();
    };

    const onKey = (e) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight") step(1);
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") step(-1);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(snapTimer.current);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKey);
    };
  }, [enabled, count, progress, step]);

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      {projects.map((project, index) => (
        <ProjectSlide
          key={project.id}
          project={project}
          index={index}
          count={count}
          smooth={smooth}
          card={card}
          onOpen={onOpen}
        />
      ))}
    </div>
  );
}
