export interface MetricItem {
  label: string;
  value: string;
  detail: string;
}

export interface FeatureItem {
  title: string;
  body: string;
  detail: string;
}

export interface WorkflowItem {
  step: string;
  title: string;
  body: string;
}

export const metrics: MetricItem[] = [
  {
    label: "Exam patterns recovered",
    value: "2.4M+",
    detail: "Across tutor notes, forums, leaked-style mocks, and archived discussions.",
  },
  {
    label: "Mock build time",
    value: "< 90s",
    detail: "From query to a timed test with reasoning modes attached.",
  },
  {
    label: "Explanation surfaces",
    value: "3 modes",
    detail: "Text, voice, and storyboard-ready video explanation outputs.",
  },
];

export const features: FeatureItem[] = [
  {
    title: "Signal-first scraping",
    body: "Point Fathom at any exam and it assembles old papers, prep forums, tutor notes, and recurring traps into a structured research pack.",
    detail: "Inspired by Firecrawl's developer-first framing, translated into a study workflow.",
  },
  {
    title: "Synthetic mock generation",
    body: "Choose between faithful replay of old problems or fresh questions that preserve the pattern but force actual understanding.",
    detail: "Useful for overfit-heavy tests where students memorize surface form.",
  },
  {
    title: "Circle-to-explain review",
    body: "Flag any question during the mock and return later for a deep explanation in whichever mode helps you retain it.",
    detail: "Works as a post-mock ritual instead of interrupting flow mid-test.",
  },
];

export const workflow: WorkflowItem[] = [
  {
    step: "01",
    title: "Name the exam",
    body: "Type SAT, JEE, MCAT, UPSC, IELTS, or anything else with a repeatable question ecology.",
  },
  {
    step: "02",
    title: "Map historical signal",
    body: "Fathom clusters repeated concepts, typical phrasing, and common distractor tactics from web-visible prep material.",
  },
  {
    step: "03",
    title: "Run the mock",
    body: "Take a timed test that mixes recovered historical patterns with newly generated variants.",
  },
  {
    step: "04",
    title: "Review what you circled",
    body: "Get concise text, audio tutoring, or storyboard-style explainer video prompts for the exact questions you marked.",
  },
];

export const logos = [
  "SAT",
  "GRE",
  "GMAT",
  "MCAT",
  "IELTS",
  "UPSC",
  "LSAT",
  "JEE",
  "NEET",
  "AP Calculus",
];
