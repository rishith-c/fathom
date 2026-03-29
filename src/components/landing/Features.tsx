"use client";

import { motion } from "framer-motion";
import {
  Search,
  FileText,
  Brain,
  CircleDot,
  MessageSquare,
  BarChart3,
  Shuffle,
  Zap,
} from "lucide-react";

interface Feature {
  icon: React.ElementType;
  title: string;
  description: string;
  tag: string;
  color: string;
}

const FEATURES: Feature[] = [
  {
    icon: Search,
    title: "Web-Scraped Test Bank",
    description:
      "Fathom crawls thousands of sources to find real past exams, practice tests, and study materials for any test you're preparing for.",
    tag: "SCRAPE",
    color: "text-green-400",
  },
  {
    icon: FileText,
    title: "AI Mock Test Generation",
    description:
      "Generate unlimited mock tests tailored to your exam. Our AI creates questions that mirror real test patterns, difficulty, and format.",
    tag: "GENERATE",
    color: "text-orange-400",
  },
  {
    icon: Shuffle,
    title: "New Problems from Old Patterns",
    description:
      "AI analyzes existing questions and generates brand-new problems based on the same patterns — or cycle through real past questions.",
    tag: "EVOLVE",
    color: "text-amber-400",
  },
  {
    icon: CircleDot,
    title: "Circle to Explain",
    description:
      "Stuck on a question? Circle it. Fathom's AI will break it down step-by-step with detailed explanations you can actually understand.",
    tag: "EXPLAIN",
    color: "text-blue-400",
  },
  {
    icon: MessageSquare,
    title: "Multi-Modal Explanations",
    description:
      "Get explanations your way — read detailed text breakdowns, listen to voice explanations, or watch AI-generated explainer videos.",
    tag: "LEARN",
    color: "text-purple-400",
  },
  {
    icon: Brain,
    title: "Adaptive Difficulty",
    description:
      "Fathom tracks your weak areas and adjusts question difficulty in real-time. Practice where you need it most.",
    tag: "ADAPT",
    color: "text-cyan-400",
  },
  {
    icon: BarChart3,
    title: "Progress Dashboard",
    description:
      "Track scores, study streaks, improvement trends, and weak areas. See exactly where you stand and what to focus on.",
    tag: "TRACK",
    color: "text-emerald-400",
  },
  {
    icon: Zap,
    title: "Instant Results",
    description:
      "Get scored immediately with detailed breakdowns. See which topics you aced and which need more work — no waiting.",
    tag: "SCORE",
    color: "text-yellow-400",
  },
];

function FeatureCard({ feature, index }: { feature: Feature; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative p-6 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300"
    >
      {/* Hover glow */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative z-10">
        {/* Tag */}
        <div className="flex items-center gap-2 mb-4">
          <span className={`font-mono text-xs ${feature.color}`}>[ {feature.tag} ]</span>
        </div>

        {/* Icon */}
        <div className="mb-4 p-2.5 rounded-lg bg-white/5 border border-white/5 w-fit">
          <feature.icon className={`w-5 h-5 ${feature.color}`} />
        </div>

        {/* Content */}
        <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
        <p className="text-sm text-zinc-400 leading-relaxed">{feature.description}</p>
      </div>
    </motion.div>
  );
}

export default function Features() {
  return (
    <section id="features" className="relative py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="font-mono text-sm text-orange-400 mb-4 block">[ FEATURES ]</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Everything you need to{" "}
            <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
              ace any test
            </span>
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto">
            From scraping real exams to AI-powered explanations, Fathom is the complete
            test preparation platform.
          </p>
        </motion.div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((feature, index) => (
            <FeatureCard key={feature.tag} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
