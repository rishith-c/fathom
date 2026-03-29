"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

const ASCII_BRAIN = `
    ██████╗ ██████╗  █████╗ ██╗███╗   ██╗
    ██╔══██╗██╔══██╗██╔══██╗██║████╗  ██║
    ██████╔╝██████╔╝███████║██║██╔██╗ ██║
    ██╔══██╗██╔══██╗██╔══██║██║██║╚██╗██║
    ██████╔╝██║  ██║██║  ██║██║██║ ╚████║
    ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝
`;

const TERMINAL_LINES = [
  { prefix: "$ ", text: 'fathom search "AP Computer Science 2025"', color: "text-green-400" },
  { prefix: "  ", text: "[ SCANNING ]  Crawling 2,847 sources...", color: "text-orange-400" },
  { prefix: "  ", text: "[ FOUND    ]  142 past exams identified", color: "text-orange-400" },
  { prefix: "  ", text: "[ GENERATE ]  Building mock test...", color: "text-amber-300" },
  { prefix: "  ", text: "[ 200 OK   ]  Mock test ready — 50 questions", color: "text-green-400" },
  { prefix: "  ", text: '[ EXPLAIN  ]  AI tutor standing by', color: "text-blue-400" },
];

function TerminalLine({ line, index }: { line: typeof TERMINAL_LINES[number]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.8 + index * 0.4, duration: 0.3 }}
      className="flex"
    >
      <span className="text-zinc-500 select-none">{line.prefix}</span>
      <span className={line.color}>{line.text}</span>
    </motion.div>
  );
}

const STATS = [
  { label: "Tests Generated", value: "50K+" },
  { label: "Questions Explained", value: "2M+" },
  { label: "Pass Rate Increase", value: "34%" },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 pt-24 pb-16">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(250,93,25,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(250,93,25,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />

      {/* Radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-orange-500/5 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-8"
        >
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Powered Test Preparation</span>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
        >
          <span className="text-white">Master any test with</span>
          <br />
          <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500 bg-clip-text text-transparent">
            AI that understands
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-10"
        >
          Fathom scrapes the web for real past exams, generates unlimited mock tests,
          and explains every question with AI — text, voice, or video.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link
            href="/test/new"
            className="group flex items-center gap-2 px-8 py-3.5 rounded-lg bg-orange-500 hover:bg-orange-400 text-black font-semibold text-base transition-all shadow-[0_0_20px_rgba(250,93,25,0.3)] hover:shadow-[0_0_30px_rgba(250,93,25,0.5)]"
          >
            Start Preparing
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <a
            href="#how-it-works"
            className="flex items-center gap-2 px-8 py-3.5 rounded-lg border border-white/10 hover:border-white/20 text-white font-medium text-base transition-all hover:bg-white/5"
          >
            See How It Works
          </a>
        </motion.div>

        {/* Terminal Demo */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <div className="rounded-xl border border-white/10 bg-black/80 backdrop-blur-xl overflow-hidden shadow-2xl shadow-orange-500/5">
            {/* Terminal header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/[0.02]">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <span className="ml-2 text-xs text-zinc-500 font-mono">fathom — terminal</span>
            </div>

            {/* ASCII Art */}
            <div className="px-6 pt-4">
              <motion.pre
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="text-orange-500/70 text-[10px] sm:text-xs font-mono leading-tight select-none"
              >
                {ASCII_BRAIN}
              </motion.pre>
            </div>

            {/* Terminal lines */}
            <div className="px-6 pb-6 pt-2 font-mono text-sm space-y-1.5">
              {TERMINAL_LINES.map((line, i) => (
                <TerminalLine key={i} line={line} index={i} />
              ))}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3.4 }}
                className="flex items-center mt-2"
              >
                <span className="text-green-400">$ </span>
                <span className="w-2 h-4 bg-orange-400 animate-pulse ml-1" />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="flex flex-wrap justify-center gap-8 sm:gap-16 mt-16"
        >
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-zinc-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2"
        >
          <div className="w-1 h-2 rounded-full bg-orange-400" />
        </motion.div>
      </motion.div>
    </section>
  );
}
