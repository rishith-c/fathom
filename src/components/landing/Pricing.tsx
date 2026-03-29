"use client";

import { motion } from "framer-motion";
import { Check, Zap, Crown } from "lucide-react";
import Link from "next/link";

interface PricingTier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  popular?: boolean;
  icon: React.ElementType;
}

const TIERS: PricingTier[] = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Get started with basic test prep",
    icon: Zap,
    features: [
      "3 mock tests per month",
      "Basic AI explanations (text only)",
      "5 question explanations per test",
      "Score tracking",
      "Community question bank",
    ],
    cta: "Start Free",
  },
  {
    name: "Pro",
    price: "$12",
    period: "per month",
    description: "Unlimited prep for serious students",
    icon: Crown,
    popular: true,
    features: [
      "Unlimited mock tests",
      "Full AI explanations (text + voice)",
      "Unlimited question explanations",
      "New problem generation",
      "Progress analytics dashboard",
      "Adaptive difficulty",
      "Priority AI processing",
      "Export tests as PDF",
    ],
    cta: "Start Pro Trial",
  },
  {
    name: "Team",
    price: "$8",
    period: "per seat / month",
    description: "For study groups and classrooms",
    icon: Zap,
    features: [
      "Everything in Pro",
      "Shared test libraries",
      "Group progress tracking",
      "Teacher/admin dashboard",
      "Custom test templates",
      "Video explanations",
      "API access",
      "Priority support",
    ],
    cta: "Contact Sales",
  },
];

function PricingCard({ tier, index }: { tier: PricingTier; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`relative rounded-xl border p-6 flex flex-col ${
        tier.popular
          ? "border-orange-500/30 bg-orange-500/[0.03] shadow-[0_0_40px_rgba(250,93,25,0.08)]"
          : "border-white/5 bg-white/[0.02]"
      }`}
    >
      {tier.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-orange-500 text-black text-xs font-semibold">
          Most Popular
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-1">{tier.name}</h3>
        <p className="text-sm text-zinc-500">{tier.description}</p>
      </div>

      <div className="mb-6">
        <span className="text-4xl font-bold text-white">{tier.price}</span>
        <span className="text-zinc-500 ml-2">/ {tier.period}</span>
      </div>

      <ul className="space-y-3 mb-8 flex-1">
        {tier.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm">
            <Check className="w-4 h-4 text-orange-400 mt-0.5 shrink-0" />
            <span className="text-zinc-300">{feature}</span>
          </li>
        ))}
      </ul>

      <Link
        href="/test/new"
        className={`block text-center py-3 rounded-lg font-semibold text-sm transition-all ${
          tier.popular
            ? "bg-orange-500 hover:bg-orange-400 text-black shadow-[0_0_20px_rgba(250,93,25,0.3)]"
            : "border border-white/10 hover:border-white/20 text-white hover:bg-white/5"
        }`}
      >
        {tier.cta}
      </Link>
    </motion.div>
  );
}

export default function Pricing() {
  return (
    <section id="pricing" className="relative py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="font-mono text-sm text-orange-400 mb-4 block">[ PRICING ]</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto">
            Start free. Upgrade when you&apos;re ready to go all in.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TIERS.map((tier, index) => (
            <PricingCard key={tier.name} tier={tier} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
