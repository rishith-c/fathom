"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface NavLink {
  readonly label: string;
  readonly href: string;
}

const NAV_LINKS: readonly NavLink[] = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
] as const;

function smoothScrollTo(href: string) {
  const id = href.replace("#", "");
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function CursorBlink() {
  return (
    <motion.span
      className="inline-block h-5 w-[3px] translate-y-[1px] bg-[#fa5d19]"
      animate={{ opacity: [1, 0] }}
      transition={{ duration: 0.7, repeat: Infinity, repeatType: "reverse" }}
      aria-hidden="true"
    />
  );
}

const mobileMenuVariants = {
  closed: {
    opacity: 0,
    height: 0,
    transition: { duration: 0.25, ease: "easeInOut" as const },
  },
  open: {
    opacity: 1,
    height: "auto" as const,
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
};

const mobileItemVariants = {
  closed: { opacity: 0, x: -12 },
  open: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.05 * i + 0.1, duration: 0.25 },
  }),
};

export function Navbar({ className }: Readonly<{ className?: string }>) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      smoothScrollTo(href);
      setMobileOpen(false);
    },
    [],
  );

  const handleCtaClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      smoothScrollTo("#get-started");
      setMobileOpen(false);
    },
    [],
  );

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        "border-b bg-black/60 backdrop-blur-xl",
        scrolled
          ? "border-[#fa5d19]/20 shadow-[0_1px_12px_rgba(250,93,25,0.08)]"
          : "border-white/5",
        className,
      )}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-1 font-mono text-lg font-bold text-white"
          aria-label="Fathom home"
        >
          <span className="text-[#fa5d19]">&gt;</span>
          <span>fathom</span>
          <CursorBlink />
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-sm text-white/60 transition-colors duration-200 hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <a
            href="#get-started"
            onClick={handleCtaClick}
            className={cn(
              "inline-flex items-center rounded-full px-5 py-2 text-sm font-medium text-white",
              "bg-[#fa5d19] transition-all duration-200 hover:bg-[#e5520f]",
              "shadow-[0_0_20px_rgba(250,93,25,0.35)] hover:shadow-[0_0_28px_rgba(250,93,25,0.5)]",
            )}
          >
            Start Preparing
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-white/70 transition-colors hover:bg-white/5 hover:text-white md:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          <AnimatePresence mode="wait">
            {mobileOpen ? (
              <motion.span
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <X className="h-5 w-5" />
              </motion.span>
            ) : (
              <motion.span
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Menu className="h-5 w-5" />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            variants={mobileMenuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="overflow-hidden border-t border-white/5 bg-black/80 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-4">
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  variants={mobileItemVariants}
                  custom={i}
                  initial="closed"
                  animate="open"
                  className="rounded-lg px-3 py-2.5 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white"
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.a
                href="#get-started"
                onClick={handleCtaClick}
                variants={mobileItemVariants}
                custom={NAV_LINKS.length}
                initial="closed"
                animate="open"
                className={cn(
                  "mt-2 inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium text-white",
                  "bg-[#fa5d19] transition-all duration-200",
                  "shadow-[0_0_20px_rgba(250,93,25,0.35)]",
                )}
              >
                Start Preparing
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export type { NavLink };
