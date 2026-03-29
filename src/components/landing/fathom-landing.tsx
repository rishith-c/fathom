import Link from "next/link";
import { ArrowRight, ChevronDown, Flame, GitBranch, Globe, Sparkles } from "lucide-react";

const navItems = [
  "Products",
  "Playground",
  "Docs",
  "Pricing",
  "Integrations",
  "Blog",
  "Resources",
];

const toolTabs = ["Search", "Scrape", "Map", "Crawl"];

export function FathomLanding() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f8fbff] text-[#212126]">
      <div className="absolute inset-x-0 top-0 z-0 h-3 bg-[var(--accent)]" />

      <div
        className="absolute inset-0 z-0 opacity-90"
        style={{
          backgroundImage:
            "linear-gradient(rgba(42,109,251,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(42,109,251,0.06) 1px, transparent 1px)",
          backgroundSize: "94px 94px",
        }}
      />

      <div className="absolute left-[7%] top-[18%] text-[12px] font-medium uppercase tracking-[0.28em] text-[#c0cbe0]">
        [ 200 OK ]
      </div>
      <div className="absolute right-[6%] top-[18%] text-[12px] font-medium uppercase tracking-[0.28em] text-[#c0cbe0]">
        [ SCRAPE ]
      </div>
      <div className="absolute left-[7%] top-[69%] text-[12px] font-medium uppercase tracking-[0.28em] text-[#c0cbe0]">
        [ .JSON ]
      </div>
      <div className="absolute right-[7%] top-[69%] text-[12px] font-medium uppercase tracking-[0.28em] text-[#c0cbe0]">
        [ .MD ]
      </div>

      <div className="absolute left-[18%] top-[23%] flex size-10 items-center justify-center rounded-full border border-[#e4ecfb] bg-[#fbfdff] text-[var(--accent)]">
        <Sparkles className="size-4" />
      </div>
      <div className="absolute right-[26%] top-[23%] flex size-10 items-center justify-center rounded-full border border-[#e4ecfb] bg-[#fbfdff] text-[var(--accent)]">
        <Sparkles className="size-4" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1120px] px-6 pb-24 pt-12 sm:px-8 lg:px-10">
        <header className="mx-auto mt-2 flex w-full items-center justify-between rounded-[26px] border border-[#e6edf8] bg-[rgba(255,255,255,0.9)] px-6 py-4 shadow-[0_12px_40px_rgba(73,111,182,0.08)] backdrop-blur">
          <Link href="/" className="flex items-center gap-3">
            <Flame className="size-5 fill-[var(--accent)] text-[var(--accent)]" />
            <span className="text-xl font-semibold tracking-tight text-[#202025]">Fathom</span>
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-8 lg:flex">
            {navItems.map((item) => (
              <a
                key={item}
                href="#"
                className="flex items-center gap-1 text-[15px] font-medium text-[#45434c]"
              >
                {item}
                {["Products", "Integrations", "Resources"].includes(item) ? (
                  <ChevronDown className="size-4 text-[#8ea2c9]" />
                ) : null}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-[#e6edf8] bg-white px-4 py-2 text-[15px] font-medium text-[#45434c] sm:flex">
              <GitBranch className="size-4" />
              100.4K
            </div>
            <Link
              href="/app"
              className="rounded-xl bg-[#eef4ff] px-4 py-2 text-[15px] font-semibold text-[#234ca2]"
            >
              Dashboard
            </Link>
          </div>
        </header>

        <section className="relative mx-auto flex min-h-[760px] flex-col items-center justify-center pt-18 text-center">
          <div className="rounded-full border border-[#dce7fb] bg-[#fbfdff] px-4 py-2 text-sm font-semibold text-[#53515a] shadow-[0_8px_20px_rgba(73,111,182,0.05)]">
            2 Months Free — Annually
          </div>

          <h1 className="mt-8 max-w-[860px] text-[56px] font-semibold leading-[0.95] tracking-[-0.05em] text-[#24242a] sm:text-[74px] lg:text-[82px]">
            Power AI students with
            <br />
            <span className="text-[var(--accent)]">clean exam data</span>
          </h1>

          <p className="mt-6 max-w-[540px] text-xl leading-9 text-[#53515a]">
            The app to search, scrape, and synthesize mock exams from the web at scale.
            <span className="rounded-md bg-[#eef4ff] px-2 py-1 text-[#315dba]"> It&apos;s built for deep prep.</span>
          </p>

          <div className="relative mt-12 w-full max-w-[520px] rounded-[28px] border border-[#e6edf8] bg-white p-3 shadow-[0_18px_60px_rgba(63,99,171,0.12)]">
            <div className="flex items-center gap-3 rounded-[22px] border border-[#eef3fc] px-4 py-4 text-left text-[#8e96ad]">
              <Globe className="size-5 text-[#9cb1db]" />
              <span className="text-lg">https://exam-source.example</span>
            </div>

            <div className="mt-3 flex items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                {toolTabs.map((tab, index) => (
                  <button
                    key={tab}
                    type="button"
                    className={`rounded-2xl px-4 py-3 text-[15px] font-semibold ${
                      index === 1
                        ? "bg-[#eef4ff] text-[var(--accent)]"
                        : "bg-[#f4f7fc] text-[#7d869b]"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <Link
                href="/auth"
                className="flex size-14 items-center justify-center rounded-2xl bg-[var(--accent)] text-white"
              >
                <ArrowRight className="size-5" />
              </Link>
            </div>
          </div>

          <div className="pointer-events-none absolute bottom-[12%] left-1/2 h-[270px] w-[92%] max-w-[980px] -translate-x-1/2 rounded-[34px] border border-[#e6edf8] bg-[rgba(255,255,255,0.62)] shadow-[0_18px_50px_rgba(63,99,171,0.08)]">
            <div className="absolute left-8 right-8 top-10 h-[190px] rounded-[24px] border border-[#e9f0fb] bg-[rgba(247,250,255,0.92)]">
              <div className="flex items-center gap-3 border-b border-[#e9f0fb] px-8 py-4">
                <div className="flex size-6 items-center justify-center rounded-full border border-[#e6edf8]" />
                <div className="h-3 w-16 rounded-full bg-[#e7eef9]" />
                <div className="ml-8 h-4 w-28 rounded-md bg-[#eef4ff]" />
                <div className="h-3 w-10 rounded-full bg-[#eef3fc]" />
                <div className="h-3 w-10 rounded-full bg-[#eef3fc]" />
                <div className="h-3 w-10 rounded-full bg-[#eef3fc]" />
              </div>

              <div className="grid grid-cols-[1.1fr_0.9fr] gap-6 px-8 py-7">
                <div>
                  <div className="h-5 w-28 rounded-md bg-[#e7eef9]" />
                  <div className="mt-5 h-14 w-full rounded-2xl bg-[#f4f8ff]" />
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    <div className="h-24 rounded-2xl bg-[#f8fbff]" />
                    <div className="h-24 rounded-2xl bg-[#f8fbff]" />
                    <div className="h-24 rounded-2xl bg-[#f8fbff]" />
                  </div>
                </div>
                <div className="rounded-[24px] border border-[#e9f0fb] bg-white px-5 py-4">
                  <div className="flex items-center justify-between">
                    <div className="h-4 w-24 rounded-md bg-[#e7eef9]" />
                    <div className="text-[12px] font-semibold uppercase tracking-[0.22em] text-[#b9c7df]">
                      [ .JSON ]
                    </div>
                  </div>
                  <div className="mt-5 space-y-3">
                    <div className="h-3 w-full rounded-full bg-[#eef3fc]" />
                    <div className="h-3 w-[88%] rounded-full bg-[#eef3fc]" />
                    <div className="h-3 w-[74%] rounded-full bg-[#eef3fc]" />
                    <div className="h-20 rounded-2xl bg-[#f6faff]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
