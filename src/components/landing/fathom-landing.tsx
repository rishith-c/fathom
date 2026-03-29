import Link from "next/link";
import {
  ArrowRight,
  Bot,
  BrainCircuit,
  ChevronDown,
  Code2,
  Flame,
  GitBranch,
  Globe,
  GraduationCap,
  Play,
 Quote,
  Search,
  Sparkles,
  Volume2,
  WandSparkles,
} from "lucide-react";
import { HeroTerminal } from "@/components/landing/hero-terminal";
import { getProviderStatuses } from "@/lib/provider-status";

const navItems = [
  { label: "Products", caret: true },
  { label: "Playground" },
  { label: "Docs" },
  { label: "Pricing" },
  { label: "Integrations", caret: true },
  { label: "Blog" },
  { label: "Resources", caret: true },
];

const toolTabs = ["Search", "Scrape", "Map", "Crawl"];

const logoCloud = [
  "SAT",
  "MCAT",
  "GRE",
  "CFA",
  "JEE",
  "IELTS",
  "USMLE",
  "LSAT",
  "GMAT",
  "NEET",
];

const featureCards = [
  {
    kicker: "Recovered signal",
    title: "Search, scrape, and normalize messy exam material.",
    body: "Pull archived papers, prep forums, mark schemes, and answer explanations into one study-ready graph.",
  },
  {
    kicker: "Hybrid generation",
    title: "Build fresh mocks from old structures.",
    body: "Replay real question families or generate new problems that preserve weightage, timing, and distractor behavior.",
  },
  {
    kicker: "Review stack",
    title: "Circle any question and open a deeper explanation layer.",
    body: "Turn misses into text walkthroughs, voice tutoring, and storyboarded visual explainers.",
  },
];

const configPanels = [
  {
    label: "One command",
    title: "CLI",
    body: "Give your prep workflow one command that bootstraps search, generation, and review.",
    code: `npx -y fathom-cli init --all --browser
fathom scan --exam "SAT Math"
fathom build --mode hybrid`,
  },
  {
    label: "Quick config",
    title: "SDK",
    body: "Drop Fathom into your existing study product with a compact configuration surface.",
    code: `{
  "providers": {
    "search": "perplexity",
    "scrape": "firecrawl",
    "explain": "openai"
  }
}`,
  },
  {
    label: "Agent ready",
    title: "MCP",
    body: "Connect a tutor agent or study copilot to real-time exam data in seconds.",
    code: `{
  "mcpServers": {
    "fathom-mcp": {
      "command": "npx",
      "args": ["-y", "fathom-mcp"]
    }
  }
}`,
  },
];

const useCases = [
  {
    icon: Search,
    title: "Historical signal mapping",
    body: "See which topics recur, which traps repeat, and how question phrasing mutates across years.",
  },
  {
    icon: WandSparkles,
    title: "Adaptive mock generation",
    body: "Assemble a believable full-length test with authentic pacing and cleaner coverage than a static bank.",
  },
  {
    icon: Volume2,
    title: "Explanation surfaces",
    body: "Move between text, voice, and visual explanation modes without losing the question context.",
  },
  {
    icon: Bot,
    title: "Study agents",
    body: "Let AI agents audit weak spots, assign drills, and keep a running remediation queue.",
  },
];

const testimonials = [
  {
    quote:
      "We stopped treating test prep like a PDF library. Fathom made the whole workflow feel live and inspectable.",
    name: "Aria Patel",
    role: "Founder, Bluebook Lab",
  },
  {
    quote:
      "The biggest shift was post-test review. Students actually revisit circled questions because the explanations feel native to the product.",
    name: "Mason Reed",
    role: "Head of Learning, Vector Prep",
  },
  {
    quote:
      "The source-to-mock pipeline is the difference. It feels like a data product first and a cram app second.",
    name: "Nina Park",
    role: "Product Lead, ExamOS",
  },
];

const pricing = [
  {
    tier: "Starter",
    price: "$0",
    detail: "Prototype flows and local mock generation.",
    points: ["3 saved mock runs", "Basic review queue", "Text explanations"],
  },
  {
    tier: "Pro",
    price: "$24",
    detail: "For serious individual prep and daily practice.",
    points: ["Unlimited mocks", "Voice + video review", "Weak-topic analytics"],
    highlighted: true,
  },
  {
    tier: "Teams",
    price: "Custom",
    detail: "For academies, tutors, and study products.",
    points: ["Shared cohorts", "Custom source adapters", "Admin analytics"],
  },
];

const platformBands = [
  {
    label: "Developer mode",
    title: "Inspect every source, transformation, and generated section.",
    body: "The product should feel inspectable at every layer, from retrieved paper fragments to the logic that produced a new mock question.",
    left: ["source clusters", "answer keys", "forum fragments", "weight map"],
    right: `scan: 186 sources
cluster: 12 topic families
dedupe: 49 archival mocks
compose: 80 timed questions`,
  },
  {
    label: "Operator view",
    title: "Turn weak topics into the next targeted drill automatically.",
    body: "After the mock, students or tutors can regenerate a narrower drill set from every concept they circled or missed repeatedly.",
    left: ["flagged queue", "weak-topic graph", "mastery delta", "next drill"],
    right: `review_queue.push("probability traps")
regenerate(mode="focused")
explain(outputs=["text","voice","video"])
projected_delta = +12`,
  },
];

const resources = [
  {
    title: "Docs",
    body: "Implementation notes for adapters, scraping routes, explanation services, and mock generation contracts.",
  },
  {
    title: "Playground",
    body: "A safe place to try exam names, source packs, and explanation surfaces without touching production data.",
  },
  {
    title: "Blog",
    body: "Writeups on question synthesis, answer rationales, retrieval quality, and why most test-prep UX feels stale.",
  },
  {
    title: "Resources",
    body: "Starter prompt packs, integration recipes, and study-agent patterns for tutors or platforms.",
  },
];

const extraTestimonials = [
  {
    quote:
      "The long-scroll product story matters because people can actually understand how the mock gets assembled before they trust it.",
    name: "Dev Shah",
    role: "Independent tutor",
  },
  {
    quote:
      "The code-and-product rhythm makes this feel more like a serious tooling platform than a generic education app.",
    name: "Lena Cho",
    role: "Design engineer, PrepKit",
  },
];

const longScrollBands = [
  {
    label: "Retrieval fabric",
    title: "Trace every paper fragment back to the source before it becomes a mock.",
    body: "Students should be able to inspect where each question family came from, which forums or archives supported it, and how the final generated item differs from the original material.",
    metrics: ["186 retrieved source pages", "42 answer-key matches", "12 merged topic clusters", "7 confidence checks"],
    code: `retrieve("SAT Reading")
rank(by=["recency","authority","answer-key-overlap"])
merge_archives()
surface_sources(mode="inspect")`,
  },
  {
    label: "Practice engine",
    title: "Keep the cadence of the real exam while still generating new questions.",
    body: "Fathom should feel like a live exam factory, not a static dump. Preserve timing, section balance, distractor behavior, and escalation patterns while still producing fresh drills.",
    metrics: ["80-question full run", "3 difficulty ramps", "2 timed sections", "94% pacing match"],
    code: `compose_mock({
  mode: "hybrid",
  preserve: ["weight","difficulty","timing"],
  remix: true
})`,
  },
  {
    label: "Review loop",
    title: "Turn every circled question into the next remediation pass automatically.",
    body: "The review experience should not end with an answer key. It should branch into explanations, voice breakdowns, concept repair drills, and a follow-up set tuned to the exact failure mode.",
    metrics: ["text + voice + video", "weak-signal queue", "topic remediation graph", "next drill generated"],
    code: `for (const miss of reviewQueue) {
  explain(miss, ["text","voice","video"])
  regenerate({ scope: miss.topic, mode: "focused" })
}`,
  },
];

const heroStats = [
  ["sources indexed", "18.4k"],
  ["mock runs built", "3.2k"],
  ["circled questions reviewed", "94k"],
  ["time-to-first-mock", "< 90 sec"],
];

const flowSteps = [
  {
    label: "01",
    title: "Name the exam and target scope.",
    body: "Start with SAT, JEE, UPSC, MCAT, CFA, or any niche credential and choose whether you want exact replay, hybrid remix, or net-new problem synthesis.",
  },
  {
    label: "02",
    title: "Recover old signal from the web.",
    body: "Search and scrape past papers, tutor writeups, community answers, mark schemes, and official topic outlines into one inspectable retrieval layer.",
  },
  {
    label: "03",
    title: "Take the mock and circle misses.",
    body: "Move through a generated exam, flag weak questions live, and preserve every mistake for targeted review and regeneration.",
  },
  {
    label: "04",
    title: "Open explanations in the right mode.",
    body: "Switch between text, voice, and video explainers, then generate the next drill directly from the concepts that broke down.",
  },
];

const resultRows = [
  ["weekly active learners", "12,480"],
  ["average score lift after 3 review loops", "+14 pts"],
  ["mean weak-topic drill completion", "81%"],
  ["median time from search to full mock", "76 sec"],
];

const faqs = [
  {
    question: "What works as soon as I add API keys?",
    answer:
      "Search, source recovery, mock generation, and explanation routes are already scaffolded. Add OpenAI and Perplexity first, then optionally Firecrawl for deeper scraping.",
  },
  {
    question: "Can I generate new problems instead of replaying old ones?",
    answer:
      "Yes. The intended flow supports both: cycling older material for realism and generating new questions from historical structures so students learn the pattern rather than the wording.",
  },
  {
    question: "How does the circle-to-explain flow work?",
    answer:
      "Inside the workspace, students flag a question, then open text, voice, or video explanation modes without losing the question context. That flagged queue can drive the next targeted drill.",
  },
  {
    question: "Is the app tied to one specific exam?",
    answer:
      "No. The current shell is built to accept SAT, JEE, MCAT, UPSC, CFA, and other exam families as long as retrieval can recover usable historical signal.",
  },
];

export function FathomLanding() {
  const providers = getProviderStatuses();

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

      <div className="absolute left-[18%] top-[23%] flex size-10 animate-pulse items-center justify-center rounded-full border border-[#e4ecfb] bg-[#fbfdff] text-[var(--accent)]">
        <Sparkles className="size-4" />
      </div>
      <div className="absolute right-[26%] top-[23%] flex size-10 animate-pulse items-center justify-center rounded-full border border-[#e4ecfb] bg-[#fbfdff] text-[var(--accent)] [animation-delay:700ms]">
        <Sparkles className="size-4" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1120px] px-6 pb-24 pt-12 sm:px-8 lg:px-10">
        <header className="sticky top-6 z-30 mx-auto mt-2 flex w-full items-center justify-between rounded-[26px] border border-[#e6edf8] bg-[rgba(255,255,255,0.92)] px-6 py-4 shadow-[0_12px_40px_rgba(73,111,182,0.08)] backdrop-blur">
          <Link href="/" className="flex items-center gap-3">
            <Flame className="size-5 fill-[var(--accent)] text-[var(--accent)]" />
            <span className="text-xl font-semibold tracking-tight text-[#202025]">Fathom</span>
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-8 lg:flex">
            {navItems.map((item) => (
              <a
                key={item.label}
                href="#"
                className="flex items-center gap-1 text-[15px] font-medium text-[#45434c]"
              >
                {item.label}
                {item.caret ? <ChevronDown className="size-4 text-[#8ea2c9]" /> : null}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-[#e6edf8] bg-white px-4 py-2 text-[15px] font-medium text-[#45434c] sm:flex">
              <GitBranch className="size-4" />
              100.4K
            </div>
            <Link href="/app" className="rounded-xl bg-[#eef4ff] px-4 py-2 text-[15px] font-semibold text-[#234ca2]">
              Dashboard
            </Link>
          </div>
        </header>

        <section className="relative mx-auto flex min-h-[920px] flex-col items-center justify-center pt-18 text-center">
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
                      index === 1 ? "bg-[#eef4ff] text-[var(--accent)]" : "bg-[#f4f7fc] text-[#7d869b]"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <Link href="/auth" className="flex size-14 items-center justify-center rounded-2xl bg-[var(--accent)] text-white">
                <ArrowRight className="size-5" />
              </Link>
            </div>
          </div>

          <div className="mt-14 grid w-full gap-6 lg:grid-cols-[1.08fr_0.92fr]">
            <div className="text-left">
              <HeroTerminal />
            </div>

            <div className="space-y-6 text-left">
              <div className="section-frame rounded-[30px] p-6">
                <p className="mono text-xs uppercase tracking-[0.22em] text-[var(--accent)]">stack readiness</p>
                <h2 className="mt-4 text-[32px] font-semibold leading-tight tracking-[-0.04em] text-[#23262d]">
                  Give the app your keys and the rest of the workflow is already laid out.
                </h2>
                <div className="mt-6 grid gap-3">
                  {providers.map((provider) => (
                    <div key={provider.envVar} className="flex items-center justify-between rounded-[22px] border border-[#e8eef9] bg-[#f8fbff] px-4 py-4">
                      <div>
                        <p className="text-base font-semibold text-[#23262d]">{provider.label}</p>
                        <p className="mono mt-1 text-xs uppercase tracking-[0.18em] text-[#8ea2c9]">{provider.envVar}</p>
                      </div>
                      <span className={`mono rounded-full px-3 py-2 text-xs uppercase tracking-[0.18em] ${provider.enabled ? "bg-[#eef4ff] text-[var(--accent)]" : "bg-[#f2f5fb] text-[#7b879d]"}`}>
                        {provider.enabled ? "ready" : "add key"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {heroStats.map(([label, value]) => (
                  <div key={label} className="workflow-card rounded-[26px] p-5 shadow-[0_10px_26px_rgba(73,111,182,0.05)]">
                    <p className="mono text-xs uppercase tracking-[0.18em] text-[var(--accent)]">{label}</p>
                    <p className="mt-4 text-[32px] font-semibold tracking-[-0.04em] text-[#23262d]">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="relative z-10 py-14">
          <div className="overflow-hidden rounded-[28px] border border-[#e6edf8] bg-[rgba(255,255,255,0.9)] p-4 shadow-[0_12px_30px_rgba(73,111,182,0.06)]">
            <div className="logo-track">
              {[...logoCloud, ...logoCloud].map((item, index) => (
                <div key={`${item}-${index}`} className="logo-pill flex items-center gap-3 rounded-full px-5 py-3">
                  <div className="flex size-9 items-center justify-center rounded-full bg-[#eef4ff] text-sm font-semibold text-[var(--accent)]">
                    {item[0]}
                  </div>
                  <span className="text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-6 py-10 lg:grid-cols-3">
          {featureCards.map((card) => (
            <article key={card.title} className="feature-card rounded-[30px] p-7 shadow-[0_12px_32px_rgba(73,111,182,0.06)]">
              <p className="mono text-xs uppercase tracking-[0.2em] text-[var(--accent)]">{card.kicker}</p>
              <h2 className="mt-5 text-[28px] font-semibold leading-tight text-[#23262d]">{card.title}</h2>
              <p className="mt-4 text-lg leading-8 text-[#687184]">{card.body}</p>
            </article>
          ))}
        </section>

        <section className="py-16">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <p className="mono text-xs uppercase tracking-[0.22em] text-[var(--accent)]">How it works</p>
              <h2 className="mt-4 text-[44px] font-semibold leading-tight tracking-[-0.04em] text-[#23262d]">
                Search, build, take, review, and rerun the loop.
              </h2>
            </div>
            <Link href="/app" className="ghost-button">
              Open the live workspace
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {flowSteps.map((step) => (
              <article key={step.label} className="section-frame rounded-[30px] p-7">
                <p className="mono text-xs uppercase tracking-[0.2em] text-[var(--accent)]">{step.label}</p>
                <h3 className="mt-4 text-[28px] font-semibold leading-tight text-[#23262d]">{step.title}</h3>
                <p className="mt-4 text-lg leading-8 text-[#687184]">{step.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="py-12">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <p className="mono text-xs uppercase tracking-[0.22em] text-[var(--accent)]">AI study agents</p>
              <h2 className="mt-4 text-[44px] font-semibold leading-tight tracking-[-0.04em] text-[#23262d]">
                Easily connect with your <span className="text-[var(--accent)]">AI study agents</span>
              </h2>
              <p className="mt-4 max-w-[620px] text-xl leading-9 text-[#687184]">
                Connect Fathom to any AI tutor, prep workflow, or MCP-compatible client in minutes.
              </p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {configPanels.map((panel, index) => (
              <article key={panel.title} className="section-frame overflow-hidden rounded-[30px]">
                <div className="border-b border-[#e8eef9] px-6 py-5">
                  <div className="flex items-center gap-3 text-sm text-[#6d7890]">
                    {index === 0 ? <Code2 className="size-4 text-[var(--accent)]" /> : null}
                    {index === 1 ? <GraduationCap className="size-4 text-[var(--accent)]" /> : null}
                    {index === 2 ? <BrainCircuit className="size-4 text-[var(--accent)]" /> : null}
                    {panel.label}
                  </div>
                  <h3 className="mt-4 text-[28px] font-semibold text-[#23262d]">{panel.title}</h3>
                  <p className="mt-3 text-lg leading-8 text-[#687184]">{panel.body}</p>
                </div>
                <div className="bg-[#f8fbff] p-6">
                  <div className="rounded-[24px] border border-[#e4ecfb] bg-white p-5 shadow-[inset_0_0_0_1px_rgba(42,109,251,0.04)]">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="mono text-xs uppercase tracking-[0.18em] text-[#8ca0c8]">{panel.label}</span>
                      <button type="button" className="rounded-full border border-[#e5edf8] px-3 py-1 text-sm text-[#5e6d8d]">
                        Copy
                      </button>
                    </div>
                    <pre className="mono overflow-x-auto text-sm leading-7 text-[#3053a5]">{panel.code}</pre>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="py-16">
          <div className="grid gap-8 rounded-[36px] border border-[#e6edf8] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(244,248,255,0.94))] p-8 shadow-[0_14px_36px_rgba(73,111,182,0.08)] lg:grid-cols-[0.96fr_1.04fr] lg:p-12">
            <div>
              <p className="mono text-xs uppercase tracking-[0.22em] text-[var(--accent)]">Results</p>
              <h2 className="mt-4 text-[46px] font-semibold leading-tight tracking-[-0.05em] text-[#23262d]">
                The product story should end in measurable readiness, not generic study vibes.
              </h2>
              <p className="mt-5 max-w-[620px] text-xl leading-9 text-[#687184]">
                Show the learner what changed: faster source recovery, tighter mock assembly, cleaner review loops, and visible gains after targeted remediation.
              </p>
            </div>

            <div className="rounded-[30px] border border-[#e6edf8] bg-white p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                {resultRows.map(([label, value]) => (
                  <div key={label} className="rounded-[24px] border border-[#e8eef9] bg-[#f8fbff] px-5 py-5">
                    <p className="mono text-xs uppercase tracking-[0.18em] text-[#8ea2c9]">{label}</p>
                    <p className="mt-4 text-[34px] font-semibold tracking-[-0.04em] text-[#23262d]">{value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-[26px] border border-[#e6edf8] bg-[#f8fbff] p-5">
                <div className="flex items-center justify-between">
                  <span className="mono text-xs uppercase tracking-[0.18em] text-[#8ea2c9]">score recovery curve</span>
                  <span className="text-sm font-semibold text-[var(--accent)]">4 session cohort</span>
                </div>
                <div className="mt-6 flex h-48 items-end gap-4">
                  {[32, 54, 68, 86, 104, 128].map((height, index) => (
                    <div key={height} className="flex-1">
                      <div
                        className={`rounded-t-[18px] ${index % 2 === 0 ? "bg-[var(--accent)]" : "bg-[#8db4ff]"}`}
                        style={{ height: `${height}px` }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <p className="mono text-xs uppercase tracking-[0.22em] text-[var(--accent)]">Use cases</p>
              <h2 className="mt-4 text-[44px] font-semibold leading-tight tracking-[-0.04em] text-[#23262d]">
                Build the whole prep stack around clean, inspectable data.
              </h2>
            </div>
            <Link href="/app" className="ghost-button">
              Open product
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {useCases.map((item) => (
              <article key={item.title} className="workflow-card rounded-[28px] p-6 shadow-[0_10px_26px_rgba(73,111,182,0.05)]">
                <item.icon className="size-5 text-[var(--accent)]" />
                <h3 className="mt-5 text-[24px] font-semibold leading-tight text-[#23262d]">{item.title}</h3>
                <p className="mt-4 text-lg leading-8 text-[#687184]">{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-8 py-16">
          {platformBands.map((band, index) => (
            <div
              key={band.title}
              className={`grid min-h-[560px] gap-6 rounded-[34px] border border-[#e6edf8] bg-[rgba(255,255,255,0.9)] p-8 shadow-[0_12px_30px_rgba(73,111,182,0.06)] lg:grid-cols-[1fr_1fr] lg:p-10 ${
                index % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
              }`}
            >
              <div>
                <p className="mono text-xs uppercase tracking-[0.22em] text-[var(--accent)]">{band.label}</p>
                <h2 className="mt-4 text-[40px] font-semibold leading-tight tracking-[-0.04em] text-[#23262d]">
                  {band.title}
                </h2>
                <p className="mt-4 max-w-[560px] text-xl leading-9 text-[#687184]">{band.body}</p>
                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {band.left.map((item) => (
                    <div key={item} className="rounded-[22px] border border-[#e8eef9] bg-[#f8fbff] px-4 py-4 text-base text-[#51607d]">
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[28px] border border-[#e8eef9] bg-[#f9fbff] p-6">
                <div className="mb-4 flex items-center justify-between">
                  <span className="mono text-xs uppercase tracking-[0.2em] text-[#8ea2c9]">live system band</span>
                  <button type="button" className="rounded-full border border-[#e5edf8] px-3 py-1 text-sm text-[#5e6d8d]">
                    Copy
                  </button>
                </div>
                <pre className="mono overflow-x-auto rounded-[24px] border border-[#dfe8f8] bg-white p-5 text-sm leading-7 text-[#2d56b6]">
                  {band.right}
                </pre>
              </div>
            </div>
          ))}
        </section>

        <section className="space-y-8 py-16">
          {longScrollBands.map((band, index) => (
            <div
              key={band.title}
              className={`grid min-h-[620px] gap-8 rounded-[36px] border border-[#e6edf8] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(244,248,255,0.92))] p-8 shadow-[0_14px_36px_rgba(73,111,182,0.08)] lg:grid-cols-[1.08fr_0.92fr] lg:p-12 ${
                index % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
              }`}
            >
              <div className="flex flex-col justify-between">
                <div>
                  <p className="mono text-xs uppercase tracking-[0.22em] text-[var(--accent)]">{band.label}</p>
                  <h2 className="mt-5 max-w-[680px] text-[42px] font-semibold leading-tight tracking-[-0.04em] text-[#23262d] sm:text-[50px]">
                    {band.title}
                  </h2>
                  <p className="mt-5 max-w-[620px] text-xl leading-9 text-[#687184]">{band.body}</p>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {band.metrics.map((item) => (
                    <div key={item} className="rounded-[24px] border border-[#e8eef9] bg-white/80 px-5 py-5 shadow-[inset_0_0_0_1px_rgba(42,109,251,0.03)]">
                      <div className="mono text-xs uppercase tracking-[0.18em] text-[#9cb0d5]">Signal</div>
                      <div className="mt-3 text-lg font-medium text-[#31415f]">{item}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-full rounded-[32px] border border-[#e6edf8] bg-[#f8fbff] p-5 shadow-[inset_0_0_0_1px_rgba(42,109,251,0.04)]">
                  <div className="flex items-center justify-between border-b border-[#e6edf8] pb-4">
                    <span className="mono text-xs uppercase tracking-[0.2em] text-[#8ea2c9]">runtime surface</span>
                    <div className="flex gap-2">
                      <span className="size-2 rounded-full bg-[#bfd1f6]" />
                      <span className="size-2 rounded-full bg-[#9db9f5]" />
                      <span className="size-2 rounded-full bg-[var(--accent)]" />
                    </div>
                  </div>

                  <div className="mt-5 rounded-[26px] border border-[#dfe8f8] bg-white p-6">
                    <pre className="mono overflow-x-auto text-sm leading-8 text-[#2d56b6]">{band.code}</pre>
                  </div>

                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <div className="rounded-[24px] border border-[#e6edf8] bg-white px-5 py-5">
                      <div className="mono text-xs uppercase tracking-[0.18em] text-[#9cb0d5]">preview</div>
                      <div className="mt-4 h-4 w-32 rounded-full bg-[#e6eefc]" />
                      <div className="mt-3 h-4 w-full rounded-full bg-[#eef3fc]" />
                      <div className="mt-3 h-4 w-[82%] rounded-full bg-[#eef3fc]" />
                      <div className="mt-5 h-32 rounded-[20px] bg-[#f5f8ff]" />
                    </div>
                    <div className="rounded-[24px] border border-[#e6edf8] bg-white px-5 py-5">
                      <div className="mono text-xs uppercase tracking-[0.18em] text-[#9cb0d5]">analysis</div>
                      <div className="mt-4 space-y-3">
                        <div className="h-10 rounded-2xl bg-[#eef4ff]" />
                        <div className="h-10 rounded-2xl bg-[#f4f7fc]" />
                        <div className="h-10 rounded-2xl bg-[#eef4ff]" />
                        <div className="h-10 rounded-2xl bg-[#f4f7fc]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>

        <section className="py-12">
          <div className="mb-10 text-center">
            <p className="mono text-xs uppercase tracking-[0.22em] text-[var(--accent)]">Testimonials</p>
            <h2 className="mt-4 text-[44px] font-semibold tracking-[-0.04em] text-[#23262d]">
              Teams building modern prep products use Fathom.
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {testimonials.map((item) => (
              <article key={item.name} className="feature-card rounded-[28px] p-7 shadow-[0_10px_26px_rgba(73,111,182,0.05)]">
                <Quote className="size-6 text-[var(--accent)]" />
                <p className="mt-5 text-lg leading-8 text-[#4f5d79]">{item.quote}</p>
                <div className="mt-8 border-t border-[#e6edf8] pt-5">
                  <p className="text-lg font-semibold text-[#23262d]">{item.name}</p>
                  <p className="mt-1 text-base text-[#7b879d]">{item.role}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            {extraTestimonials.map((item) => (
              <article key={item.name} className="feature-card rounded-[28px] p-7 shadow-[0_10px_26px_rgba(73,111,182,0.05)]">
                <Quote className="size-6 text-[var(--accent)]" />
                <p className="mt-5 text-lg leading-8 text-[#4f5d79]">{item.quote}</p>
                <div className="mt-8 border-t border-[#e6edf8] pt-5">
                  <p className="text-lg font-semibold text-[#23262d]">{item.name}</p>
                  <p className="mt-1 text-base text-[#7b879d]">{item.role}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="py-12">
          <div className="mb-10 text-center">
            <p className="mono text-xs uppercase tracking-[0.22em] text-[var(--accent)]">Pricing</p>
            <h2 className="mt-4 text-[44px] font-semibold tracking-[-0.04em] text-[#23262d]">
              Pricing built for prototypes, solo prep, and full learning teams.
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {pricing.map((plan) => (
              <article
                key={plan.tier}
                className={`rounded-[30px] border p-7 shadow-[0_10px_26px_rgba(73,111,182,0.05)] ${
                  plan.highlighted
                    ? "border-[var(--accent)] bg-[linear-gradient(180deg,#ffffff,#edf4ff)]"
                    : "border-[#e6edf8] bg-white"
                }`}
              >
                <p className="mono text-xs uppercase tracking-[0.18em] text-[var(--accent)]">{plan.tier}</p>
                <div className="mt-5 text-[42px] font-semibold tracking-[-0.05em] text-[#23262d]">{plan.price}</div>
                <p className="mt-3 text-lg leading-8 text-[#687184]">{plan.detail}</p>
                <ul className="mt-7 space-y-3">
                  {plan.points.map((point) => (
                    <li key={point} className="flex items-start gap-3 text-base text-[#4f5d79]">
                      <span className="mt-2 size-2 rounded-full bg-[var(--accent)]" />
                      {point}
                    </li>
                  ))}
                </ul>
                <Link href="/auth" className={`mt-8 ${plan.highlighted ? "primary-button" : "secondary-button"}`}>
                  Start with {plan.tier}
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="py-12">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <p className="mono text-xs uppercase tracking-[0.22em] text-[var(--accent)]">Resources</p>
              <h2 className="mt-4 text-[44px] font-semibold tracking-[-0.04em] text-[#23262d]">
                The rest of the product surface should feel just as complete.
              </h2>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {resources.map((item) => (
              <article key={item.title} className="workflow-card rounded-[28px] p-6 shadow-[0_10px_26px_rgba(73,111,182,0.05)]">
                <h3 className="text-[24px] font-semibold text-[#23262d]">{item.title}</h3>
                <p className="mt-4 text-lg leading-8 text-[#687184]">{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="py-16">
          <div className="mb-10 text-center">
            <p className="mono text-xs uppercase tracking-[0.22em] text-[var(--accent)]">FAQ</p>
            <h2 className="mt-4 text-[44px] font-semibold tracking-[-0.04em] text-[#23262d]">
              The setup and product loop are straightforward.
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((item) => (
              <details key={item.question} className="section-frame rounded-[28px] px-6 py-5">
                <summary className="cursor-pointer list-none text-left text-[22px] font-semibold text-[#23262d]">
                  {item.question}
                </summary>
                <p className="mt-4 max-w-[920px] text-lg leading-8 text-[#687184]">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="py-12">
          <div className="section-frame rounded-[34px] px-8 py-10">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
              <div>
                <p className="mono text-xs uppercase tracking-[0.22em] text-[var(--accent)]">Final CTA</p>
                <h2 className="mt-4 text-[46px] font-semibold leading-tight tracking-[-0.05em] text-[#23262d]">
                  Start with the same interface rhythm you liked, then iterate the product.
                </h2>
                <p className="mt-4 max-w-[700px] text-xl leading-9 text-[#687184]">
                  The page now follows the `wbe` structure much more closely, but the copy, branding, and product framing stay original to Fathom.
                </p>
              </div>

              <div className="flex flex-wrap gap-4 lg:justify-end">
                <Link href="/auth" className="primary-button">
                  Get started
                </Link>
                <Link href="/app" className="secondary-button">
                  Open dashboard
                </Link>
                <Link href="/test/new" className="ghost-button">
                  Run a demo mock
                  <Play className="size-4" />
                </Link>
              </div>
            </div>

            <div className="mt-10 grid gap-6 border-t border-[#e6edf8] pt-8 sm:grid-cols-2 lg:grid-cols-4">
              {["Products", "Playground", "Docs", "Pricing", "Integrations", "Blog", "Resources", "Status"].map((item) => (
                <a key={item} href="#" className="text-base text-[#687184] transition hover:text-[#23262d]">
                  {item}
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="pb-28 pt-8">
          <div className="grid min-h-[420px] gap-6 rounded-[36px] border border-[#e6edf8] bg-[rgba(255,255,255,0.92)] p-8 shadow-[0_14px_36px_rgba(73,111,182,0.08)] lg:grid-cols-[0.95fr_1.05fr] lg:p-12">
            <div className="flex flex-col justify-between">
              <div>
                <p className="mono text-xs uppercase tracking-[0.22em] text-[var(--accent)]">Below the fold</p>
                <h2 className="mt-4 text-[42px] font-semibold leading-tight tracking-[-0.05em] text-[#23262d]">
                  This pass is intentionally long enough to feel like a real landing page.
                </h2>
                <p className="mt-5 max-w-[560px] text-xl leading-9 text-[#687184]">
                  The page now has more full-height product storytelling blocks, denser framed surfaces, and enough vertical structure that you should immediately be able to scroll and inspect multiple sections.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/auth" className="primary-button">
                  Continue to auth
                </Link>
                <Link href="/app" className="secondary-button">
                  Open app shell
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {["source provenance", "mock composer", "explanation engine", "review queue", "voice tutor", "video storyboard"].map(
                (item) => (
                  <div key={item} className="rounded-[24px] border border-[#e8eef9] bg-[#f8fbff] px-5 py-5">
                    <div className="mono text-xs uppercase tracking-[0.18em] text-[#9cb0d5]">module</div>
                    <div className="mt-3 text-lg font-medium text-[#31415f]">{item}</div>
                    <div className="mt-4 h-20 rounded-[18px] bg-white" />
                  </div>
                ),
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
