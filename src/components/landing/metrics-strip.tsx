import { cn } from "@/components/ui/cn";
import type { StatItem } from "./types";

interface MetricsStripProps {
  eyebrow: string;
  title: string;
  description: string;
  metrics: StatItem[];
  className?: string;
}

export function MetricsStrip({
  eyebrow,
  title,
  description,
  metrics,
  className,
}: MetricsStripProps) {
  return (
    <section className={cn("py-16 sm:py-20", className)} aria-labelledby="fathom-metrics">
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
        <div className="space-y-4">
          <p className="text-sm font-medium uppercase tracking-[0.26em] text-white/45">
            {eyebrow}
          </p>
          <h2 id="fathom-metrics" className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {title}
          </h2>
          <p className="max-w-2xl text-base leading-7 text-white/70 sm:text-lg">
            {description}
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {metrics.map((metric) => (
            <article
              key={metric.label}
              className="rounded-[22px] border border-white/10 bg-white/5 p-5"
            >
              <p className="text-sm uppercase tracking-[0.24em] text-white/45">
                {metric.label}
              </p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-white">
                {metric.value}
              </p>
              {metric.detail ? (
                <p className="mt-2 text-sm leading-6 text-white/60">
                  {metric.detail}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
