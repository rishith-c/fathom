export type ExplanationMode = "text" | "voice" | "video";

export interface SourceItem {
  label: string;
  count: number;
}

export interface MockQuestion {
  id: string;
  title: string;
  prompt: string;
  difficulty: "Foundation" | "Applied" | "Stretch";
  tags: string[];
  insight: string;
  explanation: Record<ExplanationMode, string>;
}

export interface MockSection {
  name: string;
  duration: string;
  strategy: string;
  questionCount: number;
}

export interface GeneratedExam {
  exam: string;
  scanSummary: string;
  sourceBreakdown: SourceItem[];
  sections: MockSection[];
  questions: MockQuestion[];
  studyPlan: string[];
}

const topicBank = [
  "probability",
  "graph interpretation",
  "close reading",
  "data sufficiency",
  "historical context",
  "mechanics",
  "calculus",
  "logical reasoning",
  "scientific method",
  "writing analysis",
];

const sourceLabels = [
  "Past mocks indexed",
  "Forums mined",
  "Tutor notes clustered",
  "Official syllabus fragments",
];

function titleCase(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function examSeed(input: string) {
  return [...input].reduce((acc, char) => acc + char.charCodeAt(0), 0);
}

function buildExplanation(exam: string, title: string, mode: ExplanationMode) {
  const descriptors = {
    text: `Fathom traces this ${title.toLowerCase()} pattern back to repeated ${exam} motifs, then explains the logic in plain language and highlights the distractor strategy that usually traps candidates.`,
    voice: `Audio mode walks through the question like a live tutor: first the clue selection, then the elimination pattern, then the fastest route to the correct answer under timed pressure.`,
    video: `Video mode turns the same solution into a whiteboard-style explainer with pacing markers, worked steps, and visual callouts for where the original exam writers try to misdirect you.`,
  } as const;

  return descriptors[mode];
}

export function generateMockExam(rawExam: string): GeneratedExam {
  const exam = titleCase(rawExam.trim() || "General aptitude");
  const seed = examSeed(exam);

  const sourceBreakdown = sourceLabels.map((label, index) => ({
    label,
    count: 18 + ((seed + index * 11) % 48),
  }));

  const sections: MockSection[] = [
    {
      name: "Signal Reconstruction",
      duration: "18 min",
      strategy: "Mirror the structures that appear most often in archived papers.",
      questionCount: 8,
    },
    {
      name: "Fresh Variants",
      duration: "22 min",
      strategy: "Remix old motifs into unseen questions so memorization stops working.",
      questionCount: 10,
    },
    {
      name: "Pressure Round",
      duration: "10 min",
      strategy: "Short-answer pacing drill based on common late-test mistakes.",
      questionCount: 6,
    },
  ];

  const questions: MockQuestion[] = Array.from({ length: 5 }, (_, index) => {
    const topic = topicBank[(seed + index * 3) % topicBank.length];
    const difficulty =
      index < 2 ? "Foundation" : index < 4 ? "Applied" : "Stretch";
    const title = `${exam} ${topic} pattern ${index + 1}`;

    return {
      id: `q-${index + 1}`,
      title,
      prompt: `A student preparing for ${exam} sees a ${topic} question that resembles older papers, but the final constraint has been changed. Identify the fastest reasoning path and explain why the most attractive distractor fails.`,
      difficulty,
      tags: [topic, exam.split(" ")[0] ?? "exam", "timed"],
      insight:
        index % 2 === 0
          ? "Generated from recurring question stems plus tutor commentary."
          : "Generated from archived mocks with distractor patterns reweighted.",
      explanation: {
        text: buildExplanation(exam, title, "text"),
        voice: buildExplanation(exam, title, "voice"),
        video: buildExplanation(exam, title, "video"),
      },
    };
  });

  return {
    exam,
    scanSummary: `Fathom scanned historical ${exam} patterns, grouped the strongest motifs, and assembled a three-part mock that mixes direct echoes with net-new variations.`,
    sourceBreakdown,
    sections,
    questions,
    studyPlan: [
      `Start with old ${exam} question families to lock in recognition speed.`,
      "Switch to generated variants to learn the pattern rather than the wording.",
      "Circle misses after the mock and request a voice or video breakdown for each weak spot.",
    ],
  };
}
