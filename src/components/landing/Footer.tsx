"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const FOOTER_LINKS = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "API", href: "#" },
  ],
  Resources: [
    { label: "Documentation", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Community", href: "#" },
    { label: "Changelog", href: "#" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#" },
    { label: "GitHub", href: "https://github.com/rishith-c/fathom" },
  ],
  Legal: [
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
    { label: "Cookie Policy", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-black/40">
      {/* CTA Banner */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 pb-16 border-b border-white/5"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to{" "}
            <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
              fathom
            </span>{" "}
            your next test?
          </h2>
          <p className="text-zinc-400 mb-8 max-w-md mx-auto">
            Join thousands of students who are already preparing smarter with AI.
          </p>
          <Link
            href="/test/new"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-orange-500 hover:bg-orange-400 text-black font-semibold transition-all shadow-[0_0_20px_rgba(250,93,25,0.3)] hover:shadow-[0_0_30px_rgba(250,93,25,0.5)]"
          >
            Start Preparing — It&apos;s Free
          </Link>
        </motion.div>

        {/* Footer links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-white mb-4">{category}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-white/5">
          <div className="flex items-center gap-2">
            <span className="text-orange-400 font-mono font-bold text-lg">&gt;_</span>
            <span className="font-semibold text-white">Fathom</span>
          </div>
          <p className="text-xs text-zinc-600">
            &copy; {new Date().getFullYear()} Fathom. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
