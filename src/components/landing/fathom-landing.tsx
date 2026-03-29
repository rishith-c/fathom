import { ArrowRight, Play, Sparkles } from "lucide-react";
import { features, metrics, workflow } from "@/components/landing/data";
import { HeroTerminal } from "@/components/landing/hero-terminal";
import { LogoMarquee } from "@/components/landing/logo-marquee";
import { MockExamWorkbench } from "@/components/landing/mock-exam-workbench";

export function FathomLanding() {
  return (
    <div className="fathom-shell">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-[var(--accent)] focus:px-4 focus:py-3 focus:text-black"
      >
        Skip to main content
      </a>

      <header className="relative z-10 mx-auto flex w-full max-w-[1280px] items-center justify-between px-6 py-6 sm:px-8 lg:px-10">
        <a href="#" className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.04)]">
            <span className="mono text-sm font-semibold text-[var(--accent)]">
              FTH
            </span>
          </div>
          <div>
            <p className="mono text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
              Fathom
            </p>
            <p className="text-sm text-[var(--foreground)]">
              AI mock tests from web signals
            </p>
          </div>
        </a>

        <nav
          aria-label="Main"
          className="hidden items-center gap-6 rounded-full border border-[var(--border)] bg-[rgba(255,255,255,0.03)] px-5 py-3 lg:flex"
        >
          <a className="text-sm text-[var(--muted)]" href="#platform">
            Platform
          </a>
          <a className="text-sm text-[var(--muted)]" href="#flow">
            Flow
          </a>
          <a className="text-sm text-[var(--muted)]" href="#workbench">
            Workbench
          </a>
        </nav>

        <a className="secondary-button hidden sm:inline-flex" href="#workbench">
          Launch demo
        </a>
      </header>

      <main id="main-content" className="relative z-10 pb-20">
        <section className="mx-auto grid w-full max-w-[1280px] gap-10 px-6 pb-16 pt-6 sm:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:px-10 lg:pt-10">
          <div className="hero-grid rounded-[34px] p-6 sm:p-8 lg:p-10">
            <span className="section-kicker">web-scale exam prep</span>
            <h1 className="mt-6 max-w-4xl text-5xl font-semibold tracking-[-0.04em] sm:text-6xl lg:text-7xl">
              Turn the messy web into a full mock test pipeline.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--muted)] sm:text-lg">
              Fathom uses the same dense, terminal-heavy product language that makes
              Firecrawl feel immediate, then applies it to test prep: scan old
              question patterns, generate new mocks, and let students circle any
              problem for text, voice, or video explanations later.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a className="primary-button" href="#workbench">
                <Sparkles className="size-4" />
                Build a mock now
              </a>
              <a className="secondary-button" href="#flow">
                <Play className="size-4" />
                See the flow
              </a>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {metrics.map((metric) => (
                <div key={metric.label} className="stat-chip rounded-[26px] p-5">
                  <p className="mono text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                    {metric.label}
                  </p>
                  <p className="mt-4 text-3xl font-semibold">{metric.value}</p>
                  <p className="mt-3 text-base leading-relaxed text-[var(--muted)]">
                    {metric.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <HeroTerminal />
        </section>

        <section className="mx-auto w-full max-w-[1280px] px-6 py-8 sm:px-8 lg:px-10">
          <LogoMarquee />
        </section>

        <section
          id="platform"
          aria-labelledby="platform-title"
          className="mx-auto w-full max-w-[1280px] px-6 py-12 sm:px-8 lg:px-10"
        >
          <div className="section-frame rounded-[32px] p-6 sm:p-8 lg:p-10">
            <span className="section-kicker">product thesis</span>
            <div className="mt-5 grid gap-8 lg:grid-cols-[0.88fr_1.12fr]">
              <div>
                <h2
                  id="platform-title"
                  className="text-3xl font-semibold tracking-tight sm:text-4xl"
                >
                  The same interface rhythm as Firecrawl, but built for high-stakes studying.
                </h2>
                <p className="mt-4 text-base leading-relaxed text-[var(--muted)] sm:text-lg">
                  Dense terminal panels, visible data movement, ASCII signal cues, and
                  compact status cards make the product feel live instead of ornamental.
                  The experience centers on one job: converting historical exam signal
                  into deliberate practice you can actually learn from.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {features.map((feature) => (
                  <article key={feature.title} className="feature-card rounded-[26px] p-5">
                    <p className="mono text-xs uppercase tracking-[0.18em] text-[var(--accent)]">
                      capability
                    </p>
                    <h3 className="mt-4 text-xl font-semibold">{feature.title}</h3>
                    <p className="mt-3 text-base leading-relaxed text-[var(--muted)]">
                      {feature.body}
                    </p>
                    <p className="mt-4 text-sm leading-relaxed text-[var(--accent-strong)]">
                      {feature.detail}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          id="flow"
          aria-labelledby="flow-title"
          className="mx-auto w-full max-w-[1280px] px-6 py-12 sm:px-8 lg:px-10"
        >
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="section-kicker">entire user flow</span>
              <h2
                id="flow-title"
                className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl"
              >
                From search query to post-mock explanation loop.
              </h2>
            </div>
            <a className="ghost-button" href="#workbench">
              Jump to the demo
              <ArrowRight className="size-4" />
            </a>
          </div>

          <div className="grid gap-4 lg:grid-cols-4">
            {workflow.map((item) => (
              <article key={item.step} className="workflow-card rounded-[26px] p-6">
                <p className="workflow-index">{item.step}</p>
                <h3 className="mt-5 text-2xl font-semibold">{item.title}</h3>
                <p className="mt-4 text-base leading-relaxed text-[var(--muted)]">
                  {item.body}
                </p>
              </article>
            ))}
          </div>
        </section>

        <div className="mx-auto w-full max-w-[1280px] px-6 py-12 sm:px-8 lg:px-10">
          <MockExamWorkbench />
        </div>

        <section className="mx-auto w-full max-w-[1280px] px-6 py-12 sm:px-8 lg:px-10">
          <div className="section-frame rounded-[34px] px-6 py-8 sm:px-8 sm:py-10 lg:px-10">
            <div className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr]">
              <div>
                <span className="section-kicker">extra features</span>
                <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
                  Built for serious prep, not just pretty screenshots.
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--muted)] sm:text-lg">
                  The product can expand into spaced repetition for circled misses,
                  cohort analytics for tutors, and source traceability that shows which
                  old pattern each generated question came from.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  ["Source trace", "Every generated problem can cite the family of older prompts it came from."],
                  ["Tutor mode", "Coaches can publish shared review packs for whole cohorts after each mock."],
                  ["Weak-spot loops", "Missed questions become auto-generated drills until confidence rises."],
                  ["Media stack", "Explanation outputs can become narration, captions, and storyboard scenes."],
                ].map(([title, detail]) => (
                  <div
                    key={title}
                    className="rounded-[26px] border border-[var(--border)] bg-[rgba(255,255,255,0.03)] p-5"
                  >
                    <p className="text-lg font-semibold">{title}</p>
                    <p className="mt-3 text-base leading-relaxed text-[var(--muted)]">
                      {detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
