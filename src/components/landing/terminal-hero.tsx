import { ArrowRight, Circle, Sparkles } from "lucide-react";
import { cn } from "@/components/ui/cn";
import type { HeroTerminalFrame, HeroTerminalLine, StatItem } from "./types";

interface TerminalHeroProps {
  eyebrow: string;
  title: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
  frame: HeroTerminalFrame;
  stats: StatItem[];
  lines: HeroTerminalLine[];
  className?: string;
}

export function TerminalHero({
  eyebrow,
  title,
  description,
  primaryCta,
  secondaryCta,
  frame,
  stats,
  lines,
  className,
}: TerminalHeroProps) {
  return (
    <section
      aria-labelledby="fathom-hero-title"
      className={cn(
        "grid gap-8 pb-14 pt-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-10 lg:pb-20 lg:pt-10",
        className,
      )}
    >
      <div className="space-y-7">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/80 backdrop-blur">
          <Sparkles className="h-4 w-4 text-cyan-300" aria-hidden="true" />
          {eyebrow}
        </div>
        <div className="space-y-5">
          <h1
            id="fathom-hero-title"
            className="max-w-3xl text-5xl font-semibold tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl"
          >
            {title}
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-white/[0.72] sm:text-xl">
            {description}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href="#demo"
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-5 py-3 text-base font-medium text-black transition-transform duration-200 hover:-translate-y-0.5"
          >
            {primaryCta}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
          <a
            href="#workflow"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/[0.12] bg-white/5 px-5 py-3 text-base font-medium text-white/90 transition-colors hover:bg-white/10"
          >
            {secondaryCta}
          </a>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {stats.map((stat) => (
            <article
              key={stat.label}
              className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-[0_20px_80px_rgba(0,0,0,0.25)] backdrop-blur"
            >
              <p className="text-sm uppercase tracking-[0.24em] text-white/50">
                {stat.label}
              </p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {stat.value}
              </p>
              {stat.detail ? (
                <p className="mt-1 text-sm leading-6 text-white/65">
                  {stat.detail}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      </div>
      <div className="relative">
        <div className="absolute -left-8 top-10 hidden h-32 w-32 rounded-full bg-cyan-400/20 blur-3xl lg:block" />
        <div className="absolute -right-8 bottom-16 hidden h-28 w-28 rounded-full bg-fuchsia-400/20 blur-3xl lg:block" />
        <article className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#090b11]/90 shadow-[0_30px_120px_rgba(0,0,0,0.45)] backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-400/80" />
              <span className="h-3 w-3 rounded-full bg-amber-400/80" />
              <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-200">
              <Circle className="h-3 w-3 fill-current" aria-hidden="true" />
              {frame.status}
            </div>
          </div>
          <div className="grid gap-4 p-5 sm:grid-cols-[0.82fr_1.18fr]">
            <div className="space-y-4 rounded-2xl border border-white/10 bg-black/30 p-4">
              <div className="space-y-1">
                <p className="text-sm uppercase tracking-[0.24em] text-white/45">
                  {frame.title}
                </p>
                <p className="text-base text-white/[0.88]">{frame.input}</p>
              </div>
              <div className="space-y-2 rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.08] p-3">
                {lines.map((line) => (
                  <div key={line.label} className="flex items-center justify-between gap-3">
                    <span className="text-sm text-white/55">{line.label}</span>
                    <span className="text-sm font-medium text-white">{line.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#05070b] p-4 font-mono text-sm leading-6 text-cyan-100">
              <div className="mb-3 flex items-center justify-between text-[11px] uppercase tracking-[0.28em] text-white/35">
                <span>{frame.cursorLabel ?? "processing"}</span>
                <span>ascii-render</span>
              </div>
              <pre className="whitespace-pre-wrap text-[13px] leading-6 text-cyan-100/90">
                {frame.output.join("\n")}
                <span className="inline-block animate-pulse text-cyan-200">▌</span>
              </pre>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
