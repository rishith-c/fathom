import { cn } from "@/components/ui/cn";
import type { FeatureCardItem } from "./types";

interface FeatureGridProps {
  eyebrow: string;
  title: string;
  description: string;
  features: FeatureCardItem[];
  className?: string;
}

export function FeatureGrid({
  eyebrow,
  title,
  description,
  features,
  className,
}: FeatureGridProps) {
  return (
    <section className={cn("py-16 sm:py-20", className)} aria-labelledby="fathom-features">
      <div className="mb-10 space-y-4">
        <p className="text-sm font-medium uppercase tracking-[0.26em] text-white/45">
          {eyebrow}
        </p>
        <h2 id="fathom-features" className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          {title}
        </h2>
        <p className="max-w-3xl text-base leading-7 text-white/70 sm:text-lg">
          {description}
        </p>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {features.map((feature) => (
          <article
            key={feature.title}
            className="group rounded-[24px] border border-white/10 bg-white/5 p-5 transition-transform duration-200 hover:-translate-y-1 hover:bg-white/[0.07]"
          >
            <div className="mb-5 flex items-center justify-between">
              <span className="text-sm font-medium uppercase tracking-[0.24em] text-white/45">
                {feature.eyebrow}
              </span>
              <span
                className={cn(
                  "h-2.5 w-2.5 rounded-full",
                  feature.accent ?? "bg-cyan-300",
                )}
                aria-hidden="true"
              />
            </div>
            <h3 className="text-xl font-semibold tracking-tight text-white">
              {feature.title}
            </h3>
            <p className="mt-3 text-base leading-7 text-white/[0.68]">
              {feature.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
