"use client";
import { useEffect } from "react";
import { TransitionProvider } from "./TransitionContext";
import { LogoProvider } from "./Logo";
import Navbar from "./Navbar";

function VisualViewportSync() {
  useEffect(() => {
    const root = document.documentElement;
    const sync = () => {
      const vv = window.visualViewport;
      root.style.setProperty("--vvh", `${Math.round(vv?.height ?? window.innerHeight)}px`);
      root.style.setProperty("--vv-top", `${Math.round(vv?.offsetTop ?? 0)}px`);
    };

    sync();
    const vv = window.visualViewport;
    vv?.addEventListener("resize", sync);
    vv?.addEventListener("scroll", sync);
    window.addEventListener("resize", sync);
    window.addEventListener("orientationchange", sync);
    return () => {
      vv?.removeEventListener("resize", sync);
      vv?.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
      window.removeEventListener("orientationchange", sync);
    };
  }, []);

  return null;
}

export default function ClientLayout({ children }) {
  return (
    <TransitionProvider>
      <LogoProvider>
        <VisualViewportSync />
        <Navbar />
        {children}
      </LogoProvider>
    </TransitionProvider>
  );
}
