import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { searchForTests } from "@/lib/perplexity";

const requestSchema = z.object({
  query: z.string().trim().min(3).max(160),
  urls: z.array(z.string().url()).max(5).optional().default([]),
});

const sourceSchema = z.object({
  title: z.string(),
  url: z.string().url(),
  snippet: z.string(),
  content: z.string(),
  origin: z.enum(["search", "manual", "scrape", "demo"]),
});

const blueprintSchema = z.object({
  summary: z.string(),
  searchPlan: z.array(z.string()).min(3).max(5),
  sections: z.array(
    z.object({
      title: z.string(),
      focus: z.string(),
      questionCount: z.number().int().min(3).max(18),
      rationale: z.string(),
    }),
  ),
  prompts: z.array(z.string()).min(3).max(6),
  reviewQueue: z.array(z.string()).min(3).max(6),
});

export type ResearchPipelineInput = z.infer<typeof requestSchema>;
export type ResearchSource = z.infer<typeof sourceSchema>;
export type ResearchBlueprint = z.infer<typeof blueprintSchema>;

export interface ResearchPipelineResult {
  readonly mode: "live" | "demo";
  readonly query: string;
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

interface CandidateSource {
  readonly title: string;
  readonly url: string;
  readonly snippet: string;
  readonly origin: "search" | "manual";
}

const demoDomains = [
  "official-syllabus.example",
  "archived-paper.example",
  "community-solutions.example",
] as const;

function normalizeInput(input: unknown) {
  return requestSchema.parse(input);
}

function dedupeSources(sources: ReadonlyArray<CandidateSource>) {
  const seen = new Set<string>();
  const deduped: CandidateSource[] = [];

  for (const source of sources) {
    if (seen.has(source.url)) {
      continue;
    }

    seen.add(source.url);
    deduped.push(source);
  }

  return deduped;
}

function stripHtml(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function trimContent(content: string, maxLength = 3200) {
  return content.length > maxLength ? `${content.slice(0, maxLength)}…` : content;
}

async function fetchUrlContent(url: string) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "FathomBot/1.0 (+https://fathom.local)",
    },
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    throw new Error(`Could not fetch ${url}`);
  }

  const html = await response.text();
  return trimContent(stripHtml(html));
}

async function scrapeWithFirecrawl(url: string) {
  const apiKey = process.env.FIRECRAWL_API_KEY;
  if (!apiKey) {
    return null;
  }

  const response = await fetch("https://api.firecrawl.dev/v2/scrape", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url,
      formats: ["markdown"],
      onlyMainContent: true,
      timeout: 30000,
      location: {
        country: "US",
        languages: ["en-US"],
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Firecrawl scrape failed for ${url}`);
  }

  const data = (await response.json()) as {
    success?: boolean;
    data?: { markdown?: string };
  };

  return data.data?.markdown ? trimContent(data.data.markdown) : null;
}

async function enrichSource(source: CandidateSource, warnings: string[], usedProviders: Set<string>) {
  let content = source.snippet;
  let origin: ResearchSource["origin"] = source.origin;

  try {
    const firecrawlContent = await scrapeWithFirecrawl(source.url);
    if (firecrawlContent) {
      usedProviders.add("Firecrawl");
      content = firecrawlContent;
      origin = "scrape";
    } else if (source.origin === "manual") {
      content = await fetchUrlContent(source.url);
    }
  } catch (error) {
    warnings.push(
      error instanceof Error
        ? error.message
        : `Could not extract readable text from ${source.url}`,
    );
  }

  return sourceSchema.parse({
    title: source.title,
    url: source.url,
    snippet: source.snippet,
    content: trimContent(content || source.snippet),
    origin,
  });
}

function buildDemoSources(query: string) {
  return demoDomains.map((domain, index) => ({
    title: `${query} reference ${index + 1}`,
    url: `https://${domain}/${encodeURIComponent(query.toLowerCase().replace(/\s+/g, "-"))}`,
    snippet:
      index === 0
        ? `Official framing, topic weights, and exam objectives for ${query}.`
        : index === 1
          ? `Archived question patterns and section pacing notes for ${query}.`
          : `Community-led explanations highlighting common mistakes in ${query}.`,
    origin: "manual" as const,
  }));
}

function buildDemoBlueprint(query: string, sources: ReadonlyArray<ResearchSource>): ResearchBlueprint {
  const headline = query.split(" ").slice(0, 2).join(" ");

  return blueprintSchema.parse({
    summary: `Fathom clustered ${query} into a short-form benchmark with recovered source patterns, fresh synthesis prompts, and a review queue tuned for repeated mistakes.`,
    searchPlan: [
      `Recover the official ${headline} blueprint and topic weights.`,
      `Compare recent community discussions to find recurring traps.`,
      "Extract the most reusable answer patterns before building fresh questions.",
    ],
    sections: [
      {
        title: "Recovered Patterns",
        focus: "Mirror the question formats that show up most often.",
        questionCount: 8,
        rationale: `Anchors the mock in ${sources[0]?.title ?? "official guidance"} before generating new variants.`,
      },
      {
        title: "Fresh Variants",
        focus: "Rewrite the same concepts with different surface details.",
        questionCount: 10,
        rationale: "Prevents memorization and pressures the learner to transfer reasoning.",
      },
      {
        title: "Error Pressure Round",
        focus: "Rebuild the questions most likely to break under time pressure.",
        questionCount: 6,
        rationale: "Turns historical weak spots into a compact remediation set.",
      },
    ],
    prompts: [
      `Generate a short ${query} drill from the strongest recovered patterns.`,
      `Write fresh distractors that mimic the most common ${query} mistakes.`,
      "Produce review notes for every question the student circles twice in a row.",
    ],
    reviewQueue: [
      "Trap-first explanation",
      "Timed retry in 24 hours",
      "Topic remix after two misses",
    ],
  });
}

function extractAnthropicText(message: {
  readonly content: ReadonlyArray<{ readonly type: string; readonly text?: string }>;
}) {
  return message.content
    .filter((block) => block.type === "text")
    .map((block) => block.text ?? "")
    .join("\n")
    .trim();
}

async function buildAnthropicBlueprint(query: string, sources: ReadonlyArray<ResearchSource>) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return null;
  }

  const anthropic = new Anthropic({ apiKey });
  const corpus = sources
    .map(
      (source, index) =>
        `Source ${index + 1}\nTitle: ${source.title}\nURL: ${source.url}\nSnippet: ${source.snippet}\nContent: ${source.content}`,
    )
    .join("\n\n");

  const message = await anthropic.messages.create({
    model: process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-20250514",
    max_tokens: 1400,
    stream: false,
    system:
      "You are an assessment design strategist. Return valid JSON only. Build concise, high-signal exam blueprints from research evidence. Never include markdown fences.",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: [
              `Query: ${query}`,
              "",
              "Use the research corpus below to produce JSON with this shape:",
              '{"summary": string, "searchPlan": string[], "sections": [{"title": string, "focus": string, "questionCount": number, "rationale": string}], "prompts": string[], "reviewQueue": string[]}',
              "",
              "Constraints:",
              "- Keep the search plan to 3-5 items.",
              "- Keep sections to 3-4 items.",
              "- Keep prompts to 3-6 items.",
              "- Make it suitable for a product dashboard, not a long essay.",
              "",
              corpus,
            ].join("\n"),
          },
        ],
      },
    ],
  });

  const text = extractAnthropicText(message);
  return blueprintSchema.parse(JSON.parse(text));
}

export async function runResearchPipeline(input: unknown): Promise<ResearchPipelineResult> {
  const { query, urls } = normalizeInput(input);
  const warnings: string[] = [];
  const usedProviders = new Set<string>();
  const candidates: CandidateSource[] = [];

  if (process.env.PERPLEXITY_API_KEY) {
    try {
      const result = await searchForTests(query, { maxResults: 5 });
      usedProviders.add("Perplexity");

      for (const source of result.sources.slice(0, 4)) {
        candidates.push({
          title: source.title,
          url: source.url,
          snippet: trimContent(source.snippet || result.content, 240),
          origin: "search",
        });
      }
    } catch (error) {
      warnings.push(
        error instanceof Error
          ? error.message
          : "Perplexity search failed. Falling back to local blueprint mode.",
      );
    }
  } else {
    warnings.push("PERPLEXITY_API_KEY is missing. Search discovery is running in demo mode.");
  }

  for (const url of urls) {
    candidates.push({
      title: new URL(url).hostname.replace(/^www\./, ""),
      url,
      snippet: `Manual source added for ${query}.`,
      origin: "manual",
    });
  }

  const sourceCandidates = dedupeSources(
    candidates.length > 0 ? candidates : buildDemoSources(query),
  ).slice(0, 4);

  const sources = await Promise.all(
    sourceCandidates.map((source) => enrichSource(source, warnings, usedProviders)),
  );

  let blueprint = buildDemoBlueprint(query, sources);
  let mode: "live" | "demo" = "demo";

  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const liveBlueprint = await buildAnthropicBlueprint(query, sources);
      if (liveBlueprint) {
        usedProviders.add("Anthropic");
        blueprint = liveBlueprint;
        mode = "live";
      }
    } catch (error) {
      warnings.push(
        error instanceof Error
          ? error.message
          : "Anthropic generation failed. Showing demo blueprint.",
      );
    }
  } else {
    warnings.push("ANTHROPIC_API_KEY is missing. Exam synthesis is running in demo mode.");
  }

  const corpusCharacters = sources.reduce((total, source) => total + source.content.length, 0);

  return {
    mode,
    query,
    generatedAt: new Date().toISOString(),
    usedProviders: Array.from(usedProviders),
    warnings,
    summary: blueprint.summary,
    searchPlan: blueprint.searchPlan,
    sources,
    blueprint,
    metrics: {
      sourceCount: sources.length,
      scrapedCount: sources.filter((source) => source.origin === "scrape").length,
      corpusCharacters,
    },
  };
}
