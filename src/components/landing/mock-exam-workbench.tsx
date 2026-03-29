"use client";

import { useState } from "react";
import { AudioLines, Circle, LoaderCircle, Sparkles, Video } from "lucide-react";
import type {
  ExplanationMode,
  GeneratedExam,
  MockQuestion,
} from "@/lib/mock-exam";

const explanationModes: Array<{
  id: ExplanationMode;
  label: string;
  summary: string;
  icon: typeof Sparkles;
}> = [
  {
    id: "text",
    label: "Text",
    summary: "Quick written deconstruction with trap analysis.",
    icon: Sparkles,
  },
  {
    id: "voice",
    label: "Voice",
    summary: "Tutor-like walkthrough with pacing cues.",
    icon: AudioLines,
  },
  {
    id: "video",
    label: "Video",
    summary: "Storyboarded explainer for rewatchable review.",
    icon: Video,
  },
];

const presets = ["SAT Math", "JEE Advanced", "MCAT CARS", "UPSC Prelims"];

function DifficultyPill({ difficulty }: { difficulty: MockQuestion["difficulty"] }) {
  const tone =
    difficulty === "Foundation"
      ? "text-[var(--accent-strong)]"
      : difficulty === "Applied"
        ? "text-[var(--accent)]"
        : "text-[var(--accent-cool)]";

  return (
    <span
      className={`mono rounded-full border border-[var(--border)] px-3 py-1 text-xs uppercase tracking-[0.18em] ${tone}`}
    >
      {difficulty}
    </span>
  );
}

export function MockExamWorkbench() {
  const [examName, setExamName] = useState("SAT Math");
  const [exam, setExam] = useState<GeneratedExam | null>(null);
  const [selectedMode, setSelectedMode] = useState<ExplanationMode>("text");
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate(submittedExam: string) {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/mock-exam", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ exam: submittedExam }),
      });

      const result = (await response.json()) as GeneratedExam | { error: string };

      if (!response.ok || "error" in result) {
        throw new Error("error" in result ? result.error : "Failed to build mock.");
      }

      setExam(result);
      setSelectedQuestionId(result.questions[0]?.id ?? null);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Failed to build mock.",
      );
      setExam(null);
      setSelectedQuestionId(null);
    } finally {
      setIsLoading(false);
    }
  }

  const selectedQuestion =
    exam?.questions.find((question) => question.id === selectedQuestionId) ??
    exam?.questions[0] ??
    null;

  return (
    <section
      id="workbench"
      aria-labelledby="workbench-title"
      className="grid gap-8 xl:grid-cols-[0.92fr_1.08fr]"
    >
      <div className="section-frame rounded-[30px] p-6 sm:p-8">
        <span className="section-kicker">mock test studio</span>
        <h2
          id="workbench-title"
          className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl"
        >
          Enter any test. Fathom assembles the mock, the review queue, and the explanation stack.
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--muted)] sm:text-lg">
          This demo uses a local generation route so the flow is fully interactive
          without external API keys. The intended production flow plugs into a web
          research provider such as Perplexity or a scraping backend.
        </p>

        <form
          className="mt-8 space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            void handleGenerate(examName);
          }}
        >
          <label className="block" htmlFor="exam-name">
            <span className="mb-3 block text-base font-medium">
              Exam or credential
            </span>
            <div className="input-shell rounded-[22px] p-2">
              <input
                id="exam-name"
                value={examName}
                onChange={(event) => setExamName(event.target.value)}
                className="w-full rounded-[18px] border border-transparent bg-transparent px-4 py-4 text-base text-[var(--foreground)] placeholder:text-[var(--muted)]"
                placeholder="SAT Math, NEET Biology, CFA Level 1..."
              />
            </div>
          </label>

          <div className="flex flex-wrap gap-3">
            {presets.map((preset) => (
              <button
                key={preset}
                type="button"
                className="surface-chip rounded-full px-4 py-3 text-sm text-[var(--foreground)]"
                onClick={() => setExamName(preset)}
              >
                {preset}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-4">
            <button className="primary-button" type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <LoaderCircle className="size-4 animate-spin" />
                  Building mock
                </>
              ) : (
                <>
                  <Sparkles className="size-4" />
                  Generate mock test
                </>
              )}
            </button>
            <a className="secondary-button" href="#flow">
              See the workflow
            </a>
          </div>
        </form>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {[
            ["Mode A", "Replay archived problems exactly"],
            ["Mode B", "Generate fresh questions from old patterns"],
          ].map(([title, detail]) => (
            <div
              key={title}
              className="rounded-[24px] border border-[var(--border)] bg-[rgba(255,255,255,0.03)] p-5"
            >
              <p className="mono text-xs uppercase tracking-[0.18em] text-[var(--accent)]">
                {title}
              </p>
              <p className="mt-3 text-base leading-relaxed text-[var(--muted)]">
                {detail}
              </p>
            </div>
          ))}
        </div>

        {error ? (
          <div
            role="alert"
            className="mt-6 rounded-[24px] border border-[rgba(255,135,141,0.3)] bg-[rgba(255,135,141,0.08)] p-5 text-base text-[var(--foreground)]"
          >
            {error}
          </div>
        ) : null}
      </div>

      <div className="section-frame rounded-[30px] p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="mono text-sm uppercase tracking-[0.24em] text-[var(--accent)]">
              generated mock
            </p>
            <h3 className="mt-2 text-2xl font-semibold">
              {exam?.exam ?? "Choose an exam to preview the full flow"}
            </h3>
          </div>
          <div className="rounded-full border border-[var(--border)] px-4 py-2 text-sm text-[var(--muted)]">
            {exam ? "demo ready" : "waiting for input"}
          </div>
        </div>

        {!exam && !isLoading ? (
          <div className="mt-6 rounded-[26px] border border-dashed border-[var(--border)] p-8">
            <p className="text-base leading-relaxed text-[var(--muted)]">
              Generate a mock to populate sources, sections, question cards, and the
              circle-to-explain review panel.
            </p>
          </div>
        ) : null}

        {isLoading ? (
          <div aria-busy="true" className="mt-6 space-y-4">
            {[0, 1, 2].map((item) => (
              <div
                key={item}
                className="h-28 animate-pulse rounded-[24px] border border-[var(--border)] bg-[rgba(255,255,255,0.04)]"
              />
            ))}
          </div>
        ) : null}

        {exam ? (
          <div className="mt-6 space-y-6">
            <div className="rounded-[26px] border border-[var(--border)] bg-[rgba(255,255,255,0.03)] p-5">
              <p className="text-base leading-relaxed text-[var(--muted)]">
                {exam.scanSummary}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {exam.sourceBreakdown.map((source) => (
                <div
                  key={source.label}
                  className="rounded-[24px] border border-[var(--border)] bg-[rgba(255,255,255,0.02)] p-5"
                >
                  <p className="mono text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                    {source.label}
                  </p>
                  <p className="mt-3 text-3xl font-semibold">{source.count}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              {exam.sections.map((section) => (
                <div
                  key={section.name}
                  className="rounded-[24px] border border-[var(--border)] bg-[rgba(255,255,255,0.03)] p-5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-lg font-semibold">{section.name}</p>
                    <span className="mono text-xs uppercase tracking-[0.18em] text-[var(--accent)]">
                      {section.duration}
                    </span>
                  </div>
                  <p className="mt-3 text-base leading-relaxed text-[var(--muted)]">
                    {section.strategy}
                  </p>
                  <p className="mt-4 text-sm text-[var(--foreground)]">
                    {section.questionCount} questions
                  </p>
                </div>
              ))}
            </div>

            <div className="grid gap-6 xl:grid-cols-[0.86fr_1.14fr]">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-lg font-semibold">Question queue</p>
                  <span className="mono text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                    tap to circle
                  </span>
                </div>

                {exam.questions.map((question) => (
                  <button
                    key={question.id}
                    type="button"
                    data-active={question.id === selectedQuestion?.id}
                    className="question-card w-full rounded-[24px] p-5 text-left"
                    onClick={() => setSelectedQuestionId(question.id)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="mono text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                          {question.id}
                        </p>
                        <p className="mt-2 text-base font-semibold">
                          {question.title}
                        </p>
                      </div>
                      <Circle className="mt-1 size-4 text-[var(--accent)]" />
                    </div>
                    <p className="mt-3 text-base leading-relaxed text-[var(--muted)]">
                      {question.prompt}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <DifficultyPill difficulty={question.difficulty} />
                      {question.tags.map((tag) => (
                        <span
                          key={tag}
                          className="mono rounded-full border border-[var(--border)] px-3 py-1 text-xs uppercase tracking-[0.16em] text-[var(--muted)]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>

              {selectedQuestion ? (
                <div className="explanation-panel rounded-[28px] p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="mono text-xs uppercase tracking-[0.18em] text-[var(--accent)]">
                        review panel
                      </p>
                      <h4 className="mt-2 text-2xl font-semibold">
                        {selectedQuestion.title}
                      </h4>
                    </div>
                    <DifficultyPill difficulty={selectedQuestion.difficulty} />
                  </div>

                  <p className="mt-4 text-base leading-relaxed text-[var(--muted)]">
                    {selectedQuestion.insight}
                  </p>

                  <div className="mt-6 grid gap-3 md:grid-cols-3">
                    {explanationModes.map(({ id, label, summary, icon: Icon }) => (
                      <button
                        key={id}
                        type="button"
                        data-active={selectedMode === id}
                        className="mode-card rounded-[22px] p-4 text-left"
                        onClick={() => setSelectedMode(id)}
                        aria-pressed={selectedMode === id}
                      >
                        <Icon className="size-5 text-[var(--accent)]" />
                        <p className="mt-4 text-base font-semibold">{label}</p>
                        <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                          {summary}
                        </p>
                      </button>
                    ))}
                  </div>

                  <div className="mt-6 rounded-[24px] border border-[var(--border)] bg-[rgba(255,255,255,0.03)] p-5">
                    <p className="mono text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                      {selectedMode} explanation
                    </p>
                    <p className="mt-4 text-base leading-relaxed text-[var(--foreground)]">
                      {selectedQuestion.explanation[selectedMode]}
                    </p>
                  </div>

                  <div className="mt-6 rounded-[24px] border border-[var(--border)] bg-[rgba(255,255,255,0.02)] p-5">
                    <p className="mono text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                      suggested review plan
                    </p>
                    <ul className="mt-4 space-y-3">
                      {exam.studyPlan.map((item) => (
                        <li key={item} className="flex gap-3 text-base leading-relaxed">
                          <span className="mt-2 size-2 rounded-full bg-[var(--accent)]" />
                          <span className="text-[var(--muted)]">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
