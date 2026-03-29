"use client";

import { motion } from "framer-motion";

interface Step {
  number: string;
  title: string;
  description: string;
  terminal: string[];
}

const STEPS: Step[] = [
  {
    number: "01",
    title: "Tell us your test",
    description:
      "Enter the exam you're preparing for — SAT, AP Chemistry, MCAT, bar exam, coding interviews, or anything else.",
    terminal: [
      '$ fathom search "MCAT Biology 2025"',
      "",
      "  Searching across 4,200+ sources...",
      "  ████████████████████████░░░░ 82%",
    ],
  },
  {
    number: "02",
    title: "AI scrapes & generates",
    description:
      "Fathom crawls the web for real past exams and study materials, then AI generates a complete mock test tailored to your exam.",
    terminal: [
      "  [ FOUND    ]  89 past exams",
      "  [ FOUND    ]  1,247 practice questions",
      "  [ GENERATE ]  Creating mock test...",
      "  [ 200 OK   ]  Test ready — 60 questions",
    ],
  },
  {
    number: "03",
    title: "Take your test",
    description:
      "Work through questions at your own pace with a timer, progress bar, and the ability to flag questions for review.",
    terminal: [
      "  Question 14 of 60  [■■■■■■░░░░░░] 23%",
      "  Time: 42:18 remaining",
      "  ",
      "  ○ Flagged: 3 questions",
    ],
  },
  {
    number: "04",
    title: "Circle & understand",
    description:
      "Circle any question you're unsure about. AI explains it in depth — choose text, voice, or an explainer video breakdown.",
    terminal: [
      "  [ CIRCLE   ]  Question #14 selected",
      "  [ EXPLAIN  ]  Generating breakdown...",
      "  [ TEXT     ]  ✓ Step-by-step explanation",
      "  [ VOICE   ]  ✓ Audio ready (2:34)",
    ],
  },
];

function StepCard({ step, index }: { step: Step; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="relative"
    >
      {/* Connector line */}
      {index < STEPS.length - 1 && (
        <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-px bg-gradient-to-r from-orange-500/30 to-transparent" />
      )}

      <div className="relative p-6 rounded-xl border border-white/5 bg-white/[0.02] hover:border-orange-500/20 transition-all duration-300 h-full">
        {/* Step number */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl font-bold bg-gradient-to-b from-orange-400 to-orange-600 bg-clip-text text-transparent font-mono">
            {step.number}
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-orange-500/20 to-transparent" />
        </div>

        <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
        <p className="text-sm text-zinc-400 leading-relaxed mb-5">{step.description}</p>

        {/* Mini terminal */}
        <div className="rounded-lg border border-white/5 bg-black/60 overflow-hidden">
          <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/5">
            <div className="w-2 h-2 rounded-full bg-red-500/60" />
            <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
            <div className="w-2 h-2 rounded-full bg-green-500/60" />
          </div>
          <div className="p-3 font-mono text-xs space-y-0.5">
            {step.terminal.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.15 }}
                className={
                  line.startsWith("$")
                    ? "text-green-400"
                    : line.includes("[ FOUND")
                      ? "text-orange-400"
                      : line.includes("[ 200")
                        ? "text-green-400"
                        : line.includes("████")
                          ? "text-orange-300"
                          : line.includes("✓")
                            ? "text-green-400"
                            : "text-zinc-500"
                }
              >
                {line || "\u00A0"}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-24 px-4">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-500/[0.02] to-transparent" />

      <div className="relative max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="font-mono text-sm text-orange-400 mb-4 block">[ HOW IT WORKS ]</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Four steps to{" "}
            <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
              test mastery
            </span>
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto">
            From search to score, Fathom handles everything so you can focus on learning.
          </p>
        </motion.div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((step, index) => (
            <StepCard key={step.number} step={step} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
