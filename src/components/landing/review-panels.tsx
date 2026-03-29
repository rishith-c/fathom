import { cn } from "@/components/ui/cn";
import type { ReviewMode, ReviewQuestion } from "./types";

interface ReviewPanelsProps {
  eyebrow: string;
  title: string;
  description: string;
  question: ReviewQuestion;
  modes: ReviewMode[];
  className?: string;
}

export function ReviewPanels({
  eyebrow,
  title,
  description,
  question,
  modes,
  className,
}: ReviewPanelsProps) {
  return (
    <section className={cn("py-16 sm:py-20", className)} aria-labelledby="fathom-review">
      <div className="mb-10 space-y-4">
        <p className="text-sm font-medium uppercase tracking-[0.26em] text-white/45">
          {eyebrow}
        </p>
        <h2 id="fathom-review" className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          {title}
        </h2>
        <p className="max-w-3xl text-base leading-7 text-white/70 sm:text-lg">
          {description}
        </p>
      </div>
      <div className="grid gap-5 lg:grid-cols-[1.08fr_0.92fr]">
        <article className="rounded-[28px] border border-white/10 bg-white/5 p-5">
          <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-white/45">
                Practice Question
              </p>
              <p className="mt-2 text-base text-white/65">
                Circle any question to jump into an explanation.
              </p>
            </div>
            <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-sm text-cyan-100">
              Review mode
            </span>
          </div>
          <div className="mt-5 space-y-4">
            <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <p className="text-lg leading-8 text-white">{question.prompt}</p>
            </div>
            <ul className="grid gap-3">
              {question.options.map((option) => {
                const isAnswer = option === question.answer;

                return (
                  <li
                    key={option}
                    className={cn(
                      "rounded-2xl border px-4 py-3 text-base leading-7",
                      isAnswer
                        ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-50"
                        : "border-white/10 bg-white/5 text-white/80",
                    )}
                  >
                    {option}
                  </li>
                );
              })}
            </ul>
            <div className="rounded-2xl border border-fuchsia-400/20 bg-fuchsia-400/10 p-4">
              <p className="text-sm uppercase tracking-[0.24em] text-fuchsia-100/75">
                Why it works
              </p>
              <p className="mt-2 text-base leading-7 text-white/[0.88]">
                {question.explanation}
              </p>
            </div>
          </div>
        </article>
        <aside className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {modes.map((mode) => (
              <div
                key={mode.id}
                className="rounded-[22px] border border-white/10 bg-white/5 p-5"
              >
                <p className="text-sm uppercase tracking-[0.24em] text-white/45">
                  {mode.label}
                </p>
                <div className="mt-4 h-24 rounded-2xl border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-3">
                  <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-white/15 text-sm text-white/60">
                    {mode.id === "text" && "Explain with step-by-step text"}
                    {mode.id === "voice" && "Generate a spoken summary"}
                    {mode.id === "video" && "Render an explainer storyboard"}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-[22px] border border-white/10 bg-white/5 p-5">
            <p className="text-sm uppercase tracking-[0.24em] text-white/45">
              Question sweep
            </p>
            <p className="mt-3 text-base leading-7 text-white/[0.72]">
              Fathom can remix old mock tests into fresh variants or pull the same
              topic back into the queue for spaced repetition.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
