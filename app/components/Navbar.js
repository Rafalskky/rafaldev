"use client";
import { usePathname } from "next/navigation";
import { useTransition } from "./TransitionContext";

export default function Navbar() {
  const pathname = usePathname();
  const { navigate, showChrome } = useTransition();

  const isHome = pathname === "/";
  const isAbout = pathname === "/about";

  const handleNav = (e, href) => {
    e.preventDefault();
    if (pathname !== href) {
      navigate(href);
    }
  };

  const navItemClass = (isActive) =>
    `text-sm font-medium tracking-widest uppercase cursor-pointer obys-link ${isActive ? "active" : ""}`;

  return (
    <div
      className="fixed top-12 left-12 z-[90] w-full pointer-events-none pr-24 mix-blend-difference transition-opacity duration-700"
      style={{ opacity: showChrome ? 1 : 0 }}
    >
      <div className="flex justify-between items-start">
        <div className="pointer-events-auto" style={{ pointerEvents: showChrome ? "auto" : "none" }}>
          <nav className="flex gap-12 text-white">
            <a href="/" onClick={(e) => handleNav(e, "/")}>
              <button className={navItemClass(isHome)}>Work</button>
            </a>
            <a href="/about" onClick={(e) => handleNav(e, "/about")}>
              <button className={navItemClass(isAbout)}>About</button>
            </a>
          </nav>
        </div>

        <div className="pointer-events-auto" style={{ pointerEvents: showChrome ? "auto" : "none" }}>
          <a href="/" onClick={(e) => handleNav(e, "/")} className="text-white">
            <h1 className="text-sm font-medium tracking-[0.3em] uppercase">
              Rafal Chorazewicz
            </h1>
          </a>
        </div>
      </div>
    </div>
  );
}
