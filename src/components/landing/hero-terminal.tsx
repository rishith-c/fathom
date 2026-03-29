"use client";

import { useEffect, useState } from "react";
import { ArrowRight, AudioLines, BrainCircuit, Video } from "lucide-react";
import { cn } from "@/lib/cn";

const tabs = [
  {
    id: "capture",
    label: "capture()",
    title: "Web scan boot sequence",
    status: "crawling archived mock sets",
    steps: [
      "$ fathom scan --exam JEE Advanced",
      "· indexing tutor forums",
      "· clustering repeated calculus prompts",
      "· tagging distractor patterns",
    ],
    previewLabel: "Recovered patterns",
    previewValue: "142 motifs",
  },
  {
    id: "synthesize",
    label: "synthesize()",
    title: "Mock assembly engine",
    status: "remixing old structures into new problems",
    steps: [
      "$ fathom build --mode remix",
      "· preserving section weightage",
      "· mutating wording, data, and order",
      "· attaching rationale checkpoints",
    ],
    previewLabel: "Question bank",
    previewValue: "24 generated",
  },
  {
    id: "coach",
    label: "coach()",
    title: "Explanation dispatch",
    status: "rendering review modes for circled questions",
    steps: [
      "$ fathom explain --question q-04",
      "· writing text brief",
      "· narrating voice walkthrough",
      "· storyboarding explainer video",
    ],
    previewLabel: "Modes armed",
    previewValue: "text / voice / video",
  },
] as const;

const asciiFrames = [
  String.raw`          .----------------------.
         /  source graph        /|
        /______________________/ |
        |   SAT  GRE  MCAT    |  |
        |   LSAT UPSC IELTS   |  |
        |_____________________| /`,
  String.raw`          .----------------------.
         /  signal clustering   /|
        /______________________/ |
        |  topic  weight  trap |  |
        |   calc    0.81   A   |  |
        |_____________________| /`,
  String.raw`          .----------------------.
         /  mock generation     /|
        /______________________/ |
        |  old motifs  -> new  |  |
        |  q1 q2 q3 q4 q5 q6   |  |
        |_____________________| /`,
];

export function HeroTerminal() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]["id"]>("capture");
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    const frameTimer = window.setInterval(() => {
      setFrameIndex((current) => (current + 1) % asciiFrames.length);
    }, 1800);

    const tabTimer = window.setInterval(() => {
      setActiveTab((current) => {
        const currentIndex = tabs.findIndex((tab) => tab.id === current);
        return tabs[(currentIndex + 1) % tabs.length]?.id ?? "capture";
      });
    }, 4200);

    return () => {
      window.clearInterval(frameTimer);
      window.clearInterval(tabTimer);
    };
  }, []);

  const currentTab = tabs.find((tab) => tab.id === activeTab) ?? tabs[0];

  return (
    <div className="terminal-frame sticky-noise rounded-[28px] p-4 sm:p-6">
      <div className="scanline" />
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="signal-dot bg-[var(--danger)]" />
          <span className="signal-dot bg-[var(--accent)]" />
          <span className="signal-dot bg-[var(--accent-cool)]" />
        </div>
        <p className="mono text-sm text-[var(--muted)]">
          exam_signal_pipeline.ts
        </p>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            data-active={tab.id === activeTab}
            className="terminal-tab rounded-full px-4 py-2 text-sm"
            onClick={() => setActiveTab(tab.id)}
            aria-pressed={tab.id === activeTab}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="space-y-4 rounded-[24px] border border-[var(--border)] bg-[rgba(8,12,24,0.78)] p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="mono text-sm uppercase tracking-[0.24em] text-[var(--accent-strong)]">
                {currentTab.status}
              </p>
              <h3 className="mt-2 text-2xl font-semibold leading-tight">
                {currentTab.title}
              </h3>
            </div>
            <div className="surface-chip rounded-full px-3 py-2 text-right">
              <p className="mono text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                {currentTab.previewLabel}
              </p>
              <p className="text-base font-semibold">{currentTab.previewValue}</p>
            </div>
          </div>

          <div className="ascii-window rounded-[20px] p-5">
            <pre className="mono overflow-x-auto text-sm leading-6 text-[var(--accent-strong)]">
              {asciiFrames[frameIndex]}
            </pre>
          </div>

          <div className="space-y-2">
            {currentTab.steps.map((step) => (
              <div
                key={step}
                className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.02)] px-4 py-3"
              >
                <span className="mono text-sm text-[var(--foreground)]">{step}</span>
                <ArrowRight className="size-4 text-[var(--accent)]" />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 rounded-[24px] border border-[var(--border)] bg-[rgba(255,255,255,0.02)] p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="mono text-sm uppercase tracking-[0.24em] text-[var(--muted)]">
                live mock preview
              </p>
              <h3 className="mt-2 text-xl font-semibold">Adaptive review cockpit</h3>
            </div>
            <div className="rounded-full border border-[var(--border)] px-3 py-1 text-sm text-[var(--accent)]">
              v0.1
            </div>
          </div>

          <div className="space-y-3 rounded-[24px] border border-[var(--border)] bg-[rgba(7,10,20,0.86)] p-4">
            <div className="flex items-center justify-between">
              <p className="text-base font-semibold">Circled question queue</p>
              <span className="mono text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                04 flagged
              </span>
            </div>

            {[
              "q-01 vector projection trap",
              "q-03 inference under pressure",
              "q-04 nested probability switch",
            ].map((item, index) => (
              <div
                key={item}
                className={cn(
                  "rounded-2xl border px-4 py-3 text-sm",
                  index === 2
                    ? "border-[var(--ring)] bg-[rgba(255,125,59,0.12)]"
                    : "border-[var(--border)] bg-[rgba(255,255,255,0.02)]",
                )}
              >
                <p className="mono text-[var(--muted)]">{item}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { icon: BrainCircuit, label: "Text", detail: "rapid insight" },
              { icon: AudioLines, label: "Voice", detail: "tutor pacing" },
              { icon: Video, label: "Video", detail: "whiteboard storyboard" },
            ].map(({ icon: Icon, label, detail }) => (
              <div
                key={label}
                className="rounded-[22px] border border-[var(--border)] bg-[rgba(255,255,255,0.02)] p-4"
              >
                <Icon className="size-5 text-[var(--accent)]" />
                <p className="mt-4 text-base font-semibold">{label}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">{detail}</p>
              </div>
            ))}
          </div>

          <div className="rounded-[24px] border border-[var(--border)] bg-[rgba(255,255,255,0.03)] p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="mono text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                readiness delta
              </span>
              <span className="text-sm font-semibold text-[var(--accent-strong)]">
                +12 points projected
              </span>
            </div>
            <div className="progress-rail">
              <span style={{ width: "68%" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
