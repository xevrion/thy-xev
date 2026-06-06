"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import WeatherWidget from "./WeatherWidget";
import { ThemeToggle } from "./ThemeToggle";
import { openCommandPalette } from "./CommandPalette";

const ANCHOR_LINKS = ["About", "Now", "Contact"];
const ALL_LINKS = ["Projects", "Blogs", "Resume"];

function getLinkHref(link: string, isHomepage: boolean) {
  if (link === "Resume") return "/resume";
  if (link === "Blogs") return "/blogs";
  if (link === "Projects") return "/projects";
  if (ANCHOR_LINKS.includes(link))
    return isHomepage ? `#${link.toLowerCase()}` : `/#${link.toLowerCase()}`;
  return `/${link.toLowerCase()}`;
}

export const NavBar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const isHomepage = pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 70);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    function onDown(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node))
        setIsOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [isOpen]);

  // Close when viewport goes to md+
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const handler = (e: MediaQueryListEvent) => {
      if (e.matches) setIsOpen(false);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const isActive = (link: string) => {
    if (link === "Blogs") return pathname.startsWith("/blogs");
    if (link === "Resume") return pathname === "/resume";
    if (link === "Projects") return pathname === "/projects";
    return false;
  };

  return (
    <nav
      ref={navRef}
      className={`w-full sticky top-0 z-50 transition-all duration-150 ${scrolled && !isOpen ? "bg-gradient-to-b from-taupe to-transparent backdrop-blur-[1px]" : "bg-transparent"}`}
    >
      <div className="max-w-5xl mx-auto flex justify-between items-center px-6 sm:px-8 lg:px-10 py-4">
        {/* Logo + Weather */}
        <div className="flex items-center gap-2">
          <Link href="/">
            <div className="sg-bold text-xl sm:text-2xl text-soft-royal-blue transition-all duration-200 hover:scale-105 hover:[text-shadow:0_0_10px_#5e7aff]">
              xevrion
            </div>
          </Link>
          <WeatherWidget />
        </div>

        {/* Desktop Links + Theme Toggle */}
        <div className="hidden md:flex items-center gap-8">
          {ALL_LINKS.map((link) => {
            const href = getLinkHref(link, isHomepage);
            const active = isActive(link);
            return (
              <Link
                key={link}
                href={href}
                className={`relative font-space-grotesk text-base sm:text-lg font-bold text-soft-royal-blue transition-colors duration-250 after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:bg-soft-royal-blue after:transition-[width] after:duration-250 hover:after:w-full ${active ? "opacity-100 after:w-full" : "opacity-80 after:w-0"}`}
              >
                {link}
              </Link>
            );
          })}
          <button
            onClick={openCommandPalette}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-battleship-gray/50 text-[var(--color-text)] text-sm sg-regular hover:border-soft-royal-blue hover:text-soft-royal-blue transition-colors duration-150"
            aria-label="Open command palette"
          >
            <span>Search...</span>
            <kbd className="font-mono text-xs">⌘K</kbd>
          </button>
          <ThemeToggle />
        </div>

        {/* Mobile: theme + hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            className="text-soft-royal-blue p-1"
            onClick={() => setIsOpen((o) => !o)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown — full width, drops below nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="md:hidden border-t border-battleship-gray/10 bg-[var(--color-taupe)]/95 backdrop-blur-md shadow-lg overflow-hidden"
          >
            <nav
              className="flex flex-col divide-y divide-battleship-gray/10"
              aria-label="Mobile navigation"
            >
              {ALL_LINKS.map((link) => {
                const active = isActive(link);
                return (
                  <Link
                    key={link}
                    href={getLinkHref(link, isHomepage)}
                    onClick={() => setIsOpen(false)}
                    className={`px-6 py-3.5 font-space-grotesk text-sm font-bold transition-colors duration-150 ${
                      active
                        ? "text-soft-royal-blue"
                        : "text-[var(--color-text)] hover:text-soft-royal-blue hover:bg-battleship-gray/[0.06]"
                    }`}
                  >
                    {link}
                  </Link>
                );
              })}
              <div className="flex items-center justify-between px-6 py-3.5">
                <span className="font-space-grotesk text-sm font-bold text-[var(--color-text-muted)]">
                  Theme
                </span>
                <ThemeToggle />
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
