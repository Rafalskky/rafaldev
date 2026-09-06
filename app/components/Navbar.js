"use client";
import { usePathname } from "next/navigation";
import { useTransition } from "./TransitionContext";

export default function Navbar() {
  const pathname = usePathname();
  const { navigate, showChrome, projectOpen } = useTransition();

  const isHome = pathname === "/";
  const isAbout = pathname === "/about";

  const handleNav = (e, href) => {
    e.preventDefault();
    if (pathname !== href) {
      navigate(href);
    }
  };

  const navItemClass = (isActive) =>
    `text-xs md:text-sm font-medium tracking-widest uppercase cursor-pointer obys-link ${isActive ? "active" : ""}`;

  return (
    <div
      className={`fixed top-6 left-5 right-5 md:top-12 md:left-12 md:right-12 z-[90] pointer-events-none mix-blend-difference transition-opacity duration-700 ${projectOpen ? "max-md:hidden" : ""}`}
      style={{ opacity: showChrome ? 1 : 0 }}
    >
      <div className="flex justify-between items-start gap-6">
        <div className="pointer-events-auto" style={{ pointerEvents: showChrome ? "auto" : "none" }}>
          <nav className="flex gap-6 md:gap-12 text-white">
            <a href="/" onClick={(e) => handleNav(e, "/")}>
              <button className={`${navItemClass(isHome)} py-2`}>Work</button>
            </a>
            <a href="/about" onClick={(e) => handleNav(e, "/about")}>
              <button className={`${navItemClass(isAbout)} py-2`}>About</button>
            </a>
          </nav>
        </div>

        <div className="pointer-events-auto min-w-0" style={{ pointerEvents: showChrome ? "auto" : "none" }}>
          <a href="/" onClick={(e) => handleNav(e, "/")} className="text-white">
            <h1 className="text-[11px] md:text-sm font-medium tracking-[0.18em] md:tracking-[0.3em] uppercase text-right truncate">
              Rafal Chorazewicz
            </h1>
          </a>
        </div>
      </div>
    </div>
  );
}
