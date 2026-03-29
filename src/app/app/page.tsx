import Link from "next/link";
import { ArrowRight, AudioLines, CircleDot, LayoutDashboard, Search, Sparkles, Video } from "lucide-react";
import { MockExamWorkbench } from "@/components/landing/mock-exam-workbench";
import { getProviderStatuses } from "@/lib/provider-status";

const dashboards = [
  ["Mocks generated", "18 this week"],
  ["Circled questions", "42 pending"],
  ["Weakest topic", "Probability traps"],
  ["Best mode", "Voice review"],
];

const recentMocks = [
  {
    title: "SAT Math / adaptive full mock",
    meta: "80 questions · hybrid generation",
    status: "review 6 circled",
  },
  {
    title: "JEE Advanced / calculus sprint",
    meta: "24 questions · fresh remix set",
    status: "score 71%",
  },
  {
    title: "MCAT CARS / passage drill",
    meta: "18 questions · old pattern replay",
    status: "watch video explanations",
  },
];

export default function AppPage() {
  const providers = getProviderStatuses();

  return (
    <main className="fathom-shell min-h-screen">
      <div className="relative z-10 mx-auto w-full max-w-[1280px] px-6 py-8 sm:px-8 lg:px-10">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mono text-xs uppercase tracking-[0.24em] text-[var(--accent)]">
              actual app
            </p>
            <h1 className="mt-2 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
              Prep dashboard and mock control center.
            </h1>
          </div>
          <div className="flex gap-3">
            <Link href="/test/new" className="primary-button">
              <Sparkles className="size-4" />
              New mock
            </Link>
            <Link href="/" className="secondary-button">
              Back to landing
            </Link>
          </div>
        </header>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {dashboards.map(([label, value]) => (
            <article key={label} className="stat-chip rounded-[24px] p-5">
              <p className="mono text-xs uppercase tracking-[0.18em] text-[var(--muted)]">{label}</p>
              <p className="mt-4 text-2xl font-semibold">{value}</p>
            </article>
          ))}
        </section>

        <section className="mt-8 grid gap-6 xl:grid-cols-[0.98fr_1.02fr]">
          <article className="section-frame rounded-[30px] p-6 sm:p-8">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="mono text-xs uppercase tracking-[0.18em] text-[var(--accent)]">workspace</p>
                <h2 className="mt-2 text-2xl font-semibold">Start where the student left off</h2>
              </div>
              <LayoutDashboard className="size-5 text-[var(--accent)]" />
            </div>

            <div className="mt-6 space-y-4">
              {recentMocks.map((mock) => (
                <div
                  key={mock.title}
                  className="rounded-[24px] border border-[var(--border)] bg-[rgba(255,255,255,0.03)] p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-lg font-semibold">{mock.title}</p>
                      <p className="mt-2 text-base text-[var(--muted)]">{mock.meta}</p>
                    </div>
                    <span className="surface-chip mono rounded-full px-3 py-2 text-xs uppercase tracking-[0.18em] text-[var(--accent-strong)]">
                      {mock.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="section-frame rounded-[30px] p-6 sm:p-8">
            <p className="mono text-xs uppercase tracking-[0.18em] text-[var(--accent)]">review stack</p>
            <h2 className="mt-2 text-2xl font-semibold">Circle-to-explain remains the core action</h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {[
                [Sparkles, "Text", "Trap analysis + corrected reasoning"],
                [AudioLines, "Voice", "Tutor-style pacing and verbal explanation"],
                [Video, "Video", "Storyboarded replay of the concept"],
              ].map(([Icon, title, detail]) => {
                const Cmp = Icon as typeof Sparkles;
                return (
                  <div
                    key={title as string}
                    className="rounded-[24px] border border-[var(--border)] bg-[rgba(255,255,255,0.03)] p-5"
                  >
                    <Cmp className="size-5 text-[var(--accent)]" />
                    <p className="mt-4 text-lg font-semibold">{title as string}</p>
                    <p className="mt-2 text-base leading-relaxed text-[var(--muted)]">{detail as string}</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 rounded-[26px] border border-[var(--border)] bg-[rgba(255,255,255,0.03)] p-5">
              <div className="flex items-center gap-3">
                <CircleDot className="size-4 text-[var(--accent)]" />
                <p className="text-base font-semibold">Suggested next action</p>
              </div>
              <p className="mt-3 text-base leading-relaxed text-[var(--muted)]">
                Regenerate a focused probability drill from every circled mistake in the last two mocks.
              </p>
              <Link href="/test/new" className="ghost-button mt-4">
                Generate targeted drill
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </article>
        </section>

        <section className="mt-8 grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
          <article className="section-frame rounded-[30px] p-6 sm:p-8">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="mono text-xs uppercase tracking-[0.18em] text-[var(--accent)]">provider health</p>
                <h2 className="mt-2 text-2xl font-semibold">All that is left should be API keys.</h2>
              </div>
              <Search className="size-5 text-[var(--accent)]" />
            </div>

            <div className="mt-6 grid gap-4">
              {providers.map((provider) => (
                <div
                  key={provider.envVar}
                  className="rounded-[24px] border border-[var(--border)] bg-[rgba(255,255,255,0.03)] p-5"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-lg font-semibold">{provider.label}</p>
                      <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{provider.summary}</p>
                    </div>
                    <span
                      className={`mono rounded-full px-3 py-2 text-xs uppercase tracking-[0.18em] ${
                        provider.enabled
                          ? "bg-[rgba(42,109,251,0.08)] text-[var(--accent)]"
                          : "bg-[rgba(120,133,158,0.08)] text-[var(--muted)]"
                      }`}
                    >
                      {provider.enabled ? "configured" : "needs key"}
                    </span>
                  </div>
                  <p className="mono mt-4 text-xs uppercase tracking-[0.18em] text-[var(--accent-strong)]">
                    {provider.envVar}
                  </p>
                </div>
              ))}
            </div>
          </article>

          <article className="section-frame rounded-[30px] p-6 sm:p-8">
            <p className="mono text-xs uppercase tracking-[0.18em] text-[var(--accent)]">launch sequence</p>
            <h2 className="mt-2 text-2xl font-semibold">Run the full loop in three moves.</h2>
            <div className="mt-6 space-y-4">
              {[
                ["01", "Search the web for historical signals", "Use Perplexity and optional Firecrawl scraping to recover papers, answer keys, and community explanations."],
                ["02", "Generate or replay the mock", "Use the existing generation routes to either compose a hybrid exam or cycle older source material."],
                ["03", "Circle and explain", "Open text, voice, or video explanation modes directly from the question review stack."],
              ].map(([index, title, detail]) => (
                <div key={index} className="rounded-[24px] border border-[var(--border)] bg-[rgba(255,255,255,0.03)] p-5">
                  <div className="mono text-xs uppercase tracking-[0.18em] text-[var(--accent)]">{index}</div>
                  <p className="mt-3 text-lg font-semibold">{title}</p>
                  <p className="mt-2 text-base leading-relaxed text-[var(--muted)]">{detail}</p>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="mt-8">
          <MockExamWorkbench />
        </section>
      </div>
    </main>
  );
}
