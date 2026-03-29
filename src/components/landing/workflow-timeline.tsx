import { cn } from "@/components/ui/cn";
import type { TimelineStep } from "./types";

interface WorkflowTimelineProps {
  eyebrow: string;
  title: string;
  description: string;
  steps: TimelineStep[];
  className?: string;
}

export function WorkflowTimeline({
  eyebrow,
  title,
  description,
  steps,
  className,
}: WorkflowTimelineProps) {
  return (
    <section className={cn("py-16 sm:py-20", className)} aria-labelledby="fathom-workflow">
      <div className="mb-10 space-y-4">
        <p className="text-sm font-medium uppercase tracking-[0.26em] text-white/45">
          {eyebrow}
        </p>
        <h2 id="fathom-workflow" className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          {title}
        </h2>
        <p className="max-w-3xl text-base leading-7 text-white/70 sm:text-lg">
          {description}
        </p>
      </div>
      <ol className="grid gap-4 lg:grid-cols-4">
        {steps.map((step, index) => (
          <li
            key={step.step}
            className="rounded-[24px] border border-white/10 bg-white/5 p-5"
          >
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-medium uppercase tracking-[0.24em] text-white/45">
                {step.step}
              </span>
              <span className="text-sm text-white/50">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
            <h3 className="mt-4 text-xl font-semibold tracking-tight text-white">
              {step.title}
            </h3>
            <p className="mt-3 text-base leading-7 text-white/[0.68]">
              {step.description}
            </p>
            {step.meta ? (
              <p className="mt-4 rounded-full border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/62">
                {step.meta}
              </p>
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  );
}
