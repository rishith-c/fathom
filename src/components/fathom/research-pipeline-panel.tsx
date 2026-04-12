"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { ArrowRight, LoaderCircle, Search, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ResearchSource {
  readonly title: string;
  readonly url: string;
  readonly snippet: string;
  readonly content: string;
  readonly origin: "search" | "manual" | "scrape" | "demo";
}

interface ResearchBlueprint {
  readonly summary: string;
  readonly searchPlan: ReadonlyArray<string>;
  readonly sections: ReadonlyArray<{
    readonly title: string;
    readonly focus: string;
    readonly questionCount: number;
    readonly rationale: string;
  }>;
  readonly prompts: ReadonlyArray<string>;
  readonly reviewQueue: ReadonlyArray<string>;
}

interface ResearchResult {
  readonly mode: "live" | "demo";
  readonly generatedAt: string;
  readonly usedProviders: ReadonlyArray<string>;
  readonly warnings: ReadonlyArray<string>;
  readonly summary: string;
  readonly searchPlan: ReadonlyArray<string>;
  readonly sources: ReadonlyArray<ResearchSource>;
  readonly blueprint: ResearchBlueprint;
  readonly metrics: {
    readonly sourceCount: number;
    readonly scrapedCount: number;
    readonly corpusCharacters: number;
  };
}

const defaultUrls = "https://example.com/syllabus\nhttps://example.com/archived-paper";

export function ResearchPipelinePanel() {
  const [query, setQuery] = useState("SAT Math adaptive practice");
  const [urls, setUrls] = useState(defaultUrls);
  const [result, setResult] = useState<ResearchResult | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submitPipeline(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);

    const response = await fetch("/api/pipeline", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        urls: urls
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),
      }),
    });

    const payload = (await response.json().catch(() => null)) as
      | (ResearchResult & { error?: never })
      | { error?: string }
      | null;

    if (!response.ok || !payload || "error" in payload) {
      setError(payload?.error ?? "Pipeline failed.");
      setPending(false);
      return;
    }

    setResult(payload as ResearchResult);
    setPending(false);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.94fr_1.06fr]">
      <Card className="surface-panel rounded-[32px]">
        <CardHeader>
          <Badge variant="outline" className="w-fit">
            Research run
          </Badge>
          <CardTitle className="text-2xl">Scour the web, scrape the text, then draft the exam plan.</CardTitle>
          <CardDescription>
            This panel supports live provider-backed runs when keys exist and a demo fallback when they do not.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={submitPipeline}>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-foreground">Exam query</span>
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="JEE Advanced mechanics speed drill"
                required
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-foreground">
                Seed URLs
              </span>
              <Textarea
                value={urls}
                onChange={(event) => setUrls(event.target.value)}
                placeholder="One URL per line"
              />
            </label>

            <div className="flex flex-wrap gap-3">
              <Button type="submit" size="lg" disabled={pending}>
                {pending ? (
                  <>
                    <LoaderCircle className="size-4 animate-spin" />
                    Running pipeline
                  </>
                ) : (
                  <>
                    <Search className="size-4" />
                    Run pipeline
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => {
                  setQuery("MCAT CARS dense passage review");
                  setUrls(defaultUrls);
                }}
              >
                Reset sample
              </Button>
            </div>

            {error ? (
              <div role="alert" className="rounded-[22px] border border-border bg-secondary/70 p-4 text-sm text-muted-foreground">
                {error}
              </div>
            ) : null}
          </form>
        </CardContent>
      </Card>

      <Card className="surface-panel rounded-[32px]">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <Badge variant={result?.mode === "live" ? "success" : "outline"} className="w-fit">
                {result?.mode === "live" ? "Live providers" : "Demo blueprint"}
              </Badge>
              <CardTitle className="mt-4 text-2xl">Pipeline output</CardTitle>
            </div>
            <div className="text-right">
              <p className="mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                sources
              </p>
              <p className="mt-2 text-2xl font-semibold">{result?.metrics.sourceCount ?? 0}</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {!result ? (
            <div className="rounded-[24px] border border-dashed border-border bg-background/40 p-8">
              <p className="text-base leading-relaxed text-muted-foreground">
                Run a query to populate sources, search steps, and an exam blueprint.
              </p>
            </div>
          ) : null}

          {result ? (
            <>
              <div className="rounded-[24px] border border-border bg-background/70 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-lg font-semibold">Summary</p>
                  <div className="flex flex-wrap gap-2">
                    {result.usedProviders.map((provider) => (
                      <Badge key={provider} variant="outline">
                        {provider}
                      </Badge>
                    ))}
                  </div>
                </div>
                <p className="mt-3 text-base leading-relaxed text-muted-foreground">{result.summary}</p>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-[24px] border border-border bg-background/70 p-5">
                  <p className="text-lg font-semibold">Search plan</p>
                  <div className="data-list mt-4">
                    {result.searchPlan.map((item) => (
                      <div key={item} className="data-row">
                        <p className="text-base leading-relaxed text-foreground">{item}</p>
                        <ArrowRight className="mt-1 size-4 text-accent" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[24px] border border-border bg-background/70 p-5">
                  <p className="text-lg font-semibold">Review queue</p>
                  <div className="data-list mt-4">
                    {result.blueprint.reviewQueue.map((item) => (
                      <div key={item} className="data-row">
                        <p className="text-base leading-relaxed text-foreground">{item}</p>
                        <Sparkles className="mt-1 size-4 text-accent" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-[24px] border border-border bg-background/70 p-5">
                <p className="text-lg font-semibold">Sections</p>
                <div className="mt-4 grid gap-3">
                  {result.blueprint.sections.map((section) => (
                    <div key={section.title} className="rounded-[20px] border border-border bg-secondary/70 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="text-base font-semibold">{section.title}</p>
                        <Badge variant="outline">{section.questionCount} questions</Badge>
                      </div>
                      <p className="mt-2 text-base leading-relaxed text-muted-foreground">{section.focus}</p>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{section.rationale}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
