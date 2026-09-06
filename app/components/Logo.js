"use client";
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValue, animate, useTransform } from "framer-motion";

const LOGO_SIZE = 250;

export function logoSplitDistance(viewportWidth) {
  let cardWidth;
  if (viewportWidth < 640) cardWidth = Math.round(Math.min(viewportWidth * 0.62, 260));
  else if (viewportWidth < 1024) cardWidth = Math.round(Math.min(viewportWidth * 0.4, 320));
  else cardWidth = Math.round(Math.min(viewportWidth * 0.22, 380));
  return cardWidth / 2 + (viewportWidth < 768 ? 28 : 64);
}

const LogoContext = createContext(null);

export function LogoProvider({ children }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [zIndex, setZIndex] = useState(20);
  const [splitDistance, setSplitDistance] = useState(254);
  const scrollProgress = useMotionValue(0);
  const completeRef = useRef(null);

  const value = useMemo(
    () => ({
      isLoaded,
      setIsLoaded,
      hidden,
      setHidden,
      zIndex,
      setZIndex,
      splitDistance,
      setSplitDistance,
      scrollProgress,
      completeRef,
    }),
    [isLoaded, hidden, zIndex, splitDistance, scrollProgress]
  );

  return (
    <LogoContext.Provider value={value}>
      {children}
      <LogoStage />
    </LogoContext.Provider>
  );
}

export function useLogo() {
  const ctx = useContext(LogoContext);
  if (!ctx) throw new Error("useLogo must be used within LogoProvider");
  return ctx;
}

function LogoStage() {
  const { isLoaded, hidden, zIndex, splitDistance, scrollProgress, completeRef } = useLogo();
  const entrySplit = useMotionValue(0);
  const splitAmt = useMotionValue(splitDistance);

  useEffect(() => {
    splitAmt.set(splitDistance);
  }, [splitDistance, splitAmt]);

  useEffect(() => {
    if (hidden) return undefined;
    if (!isLoaded) {
      const controls = animate(entrySplit, 0, { duration: 1.2, ease: [0.76, 0, 0.24, 1] });
      return () => controls.stop();
    }
    if (entrySplit.get() === 1) {
      completeRef.current?.();
      return undefined;
    }
    const controls = animate(entrySplit, 1, {
      duration: 1.5,
      ease: [0.76, 0, 0.24, 1],
      onComplete: () => completeRef.current?.(),
    });
    return () => controls.stop();
  }, [isLoaded, entrySplit, hidden, completeRef]);

  const scrollFactor = useTransform(scrollProgress, [0, 0.25], [1, 0]);
  const open = useTransform([entrySplit, scrollFactor], ([split, factor]) => split * factor);
  const leftX = useTransform([open, splitAmt], ([v, amt]) => -amt * v);
  const rightX = useTransform([open, splitAmt], ([v, amt]) => amt * v);

  return (
    <div
      data-logo-stage="true"
      className="fixed left-0 w-full flex items-center justify-center pointer-events-none"
      style={{
        top: 0,
        bottom: "auto",
        height: "100svh",
        maxHeight: "100svh",
        zIndex,
        mixBlendMode: "difference",
        filter: "invert(1)",
        opacity: hidden ? 0 : 1,
        transition: "opacity 0.4s ease",
      }}
    >
      <div className="flex items-center justify-center" aria-hidden="true">
        <motion.img
          src="/logo/r.png?v=2"
          alt=""
          width={465}
          height={475}
          draggable={false}
          className="select-none"
          style={{ x: leftX, y: 0, height: LOGO_SIZE, width: "auto" }}
        />
        <motion.img
          src="/logo/c.png?v=2"
          alt=""
          width={409}
          height={480}
          draggable={false}
          className="select-none"
          style={{ x: rightX, y: 0, height: LOGO_SIZE, width: "auto" }}
        />
      </div>
    </div>
  );
}
