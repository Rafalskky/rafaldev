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

/* Step between card centers, as % of card height. */
const STEP = 108;

function CaseSlide({ src, alt, index, count, smooth, onSelect }) {
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
      className="absolute left-1/2 top-1/2 h-[72%] aspect-[3/4] max-w-[85%]"
      style={{ x: "-50%", y, scale, opacity, zIndex, filter: grayscale }}
    >
      <button
        type="button"
        onClick={() => onSelect(index)}
        className="relative block w-full h-full cursor-pointer overflow-hidden bg-zinc-900"
        aria-label={`${alt} — image ${index + 1} of ${count}`}
        tabIndex={-1}
      >
        <Image src={src} alt={`${alt} — screenshot ${index + 1}`} fill sizes="45vw" className="object-cover" />
      </button>
    </motion.div>
  );
}

export default function CaseGallery({ images, alt }) {
  const count = images.length;
  const progress = useMotionValue(0);
  const smooth = useSpring(progress, { stiffness: 160, damping: 28, mass: 0.9 });
  const [current, setCurrent] = useState(0);
  const snapTimer = useRef(null);

  const barWidth = useTransform(smooth, (v) => {
    const p = (((v % count) + count) % count) / count;
    return `${(p + 1 / count) * 100}%`;
  });

  useEffect(() => {
    progress.jump(0);
    smooth.jump(0);
  }, [images, progress, smooth]);

  useEffect(() => {
    const unsubscribe = smooth.on("change", (v) => {
      const idx = ((Math.round(v) % count) + count) % count;
      setCurrent(idx);
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
    if (count < 2) return undefined;

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
      progress.set(progress.get() + (lastY - y) * 0.006);
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
  }, [count, progress, step]);

  if (count === 1) {
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="relative h-[72%] aspect-[3/4] max-w-[85%]">
          <Image src={images[0]} alt={alt} fill sizes="45vw" className="object-cover" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      {images.map((src, index) => (
        <CaseSlide
          key={`${src}-${index}`}
          src={src}
          alt={alt}
          index={index}
          count={count}
          smooth={smooth}
          onSelect={goTo}
        />
      ))}

      <div className="absolute bottom-8 left-0 right-0 z-30 flex items-end justify-between px-8 text-white pointer-events-none">
        <div className="flex items-baseline gap-2 font-bold tracking-widest tabular-nums">
          <span className="text-sm">{String(current + 1).padStart(2, "0")}</span>
          <span className="text-[10px] opacity-50">/ {String(count).padStart(2, "0")}</span>
        </div>

        <div className="flex-1 mx-8 mb-1.5 h-px bg-white/20 relative overflow-hidden">
          <motion.div className="absolute inset-y-0 left-0 bg-white" style={{ width: barWidth }} />
        </div>

        <div className="flex gap-4 pointer-events-auto">
          <button
            type="button"
            onClick={() => step(-1)}
            className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
            aria-label="Previous image"
          >
            Prev
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
            aria-label="Next image"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
