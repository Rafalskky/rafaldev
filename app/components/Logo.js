"use client";
import { useEffect } from "react";
import { motion, useMotionValue, animate, useTransform } from "framer-motion";

export default function Logo({
  isLoaded,
  scrollYProgress,
  zIndex = 20,
  onAnimationComplete,
  hidden = false,
  splitDistance = 200,
}) {
  const entrySplit = useMotionValue(0);
  const fallbackScroll = useMotionValue(0);
  const internalScroll = scrollYProgress ?? fallbackScroll;
  const splitAmt = useMotionValue(splitDistance);

  useEffect(() => {
    splitAmt.set(splitDistance);
  }, [splitDistance, splitAmt]);

  useEffect(() => {
    if (hidden) return;
    if (isLoaded) {
      animate(entrySplit, 1, {
        duration: 1.5,
        ease: [0.76, 0, 0.24, 1],
        onComplete: onAnimationComplete,
      });
    } else {
      animate(entrySplit, 0, { duration: 1.2, ease: [0.76, 0, 0.24, 1] });
    }
  }, [isLoaded, entrySplit, onAnimationComplete, hidden]);

  const scrollFactor = useTransform(internalScroll, [0, 0.25], [1, 0]);
  const open = useTransform([entrySplit, scrollFactor], ([split, factor]) =>
    scrollYProgress ? split * factor : split
  );
  const leftX = useTransform([open, splitAmt], ([v, amt]) => -amt * v);
  const rightX = useTransform([open, splitAmt], ([v, amt]) => amt * v);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center pointer-events-none"
      style={{
        zIndex,
        mixBlendMode: "difference",
        filter: "invert(1)",
        opacity: hidden ? 0 : 1,
        transition: "opacity 0.4s ease",
      }}
    >
      <svg
        width="360"
        height="240"
        viewBox="-80 0 380 220"
        fill="none"
        overflow="visible"
        aria-hidden="true"
      >
        <motion.g style={{ x: leftX }}>
          <path
            d="M92 36 C52 36 36 62 36 110 C36 158 52 184 92 184"
            stroke="#000"
            strokeWidth="14"
            strokeLinecap="square"
          />
        </motion.g>
        <motion.g style={{ x: rightX }}>
          <path
            d="M128 36 C168 36 184 62 184 110 C184 158 168 184 128 184"
            stroke="#000"
            strokeWidth="14"
            strokeLinecap="square"
          />
        </motion.g>
      </svg>
    </div>
  );
}
