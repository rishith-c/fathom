"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Flag,
  CircleDot,
  Clock,
  ChevronDown,
  CheckCircle2,
  XCircle,
  BarChart3,
  MessageSquare,
  Volume2,
  Video,
} from "lucide-react";
import Link from "next/link";

// Demo questions for when no API is configured
type DemoQuestion = {
  id: string;
  type: "mcq" | "true-false" | "free-response";
  text: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
  topic: string;
};

const DEMO_QUESTIONS: DemoQuestion[] = [
  {
    id: "q1",
    type: "mcq" as const,
    text: "What is the time complexity of binary search on a sorted array of n elements?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    correctAnswer: "O(log n)",
    explanation: "Binary search halves the search space with each comparison, resulting in logarithmic time complexity.",
    difficulty: "easy" as const,
    topic: "Algorithms",
  },
  {
    id: "q2",
    type: "mcq" as const,
    text: "Which data structure uses LIFO (Last In, First Out) ordering?",
    options: ["Queue", "Stack", "Linked List", "Tree"],
    correctAnswer: "Stack",
    explanation: "A stack follows LIFO ordering where the last element pushed is the first one popped.",
    difficulty: "easy" as const,
    topic: "Data Structures",
  },
  {
    id: "q3",
    type: "mcq" as const,
    text: "What is the worst-case time complexity of quicksort?",
    options: ["O(n)", "O(n log n)", "O(n²)", "O(2ⁿ)"],
    correctAnswer: "O(n²)",
    explanation: "Quicksort degrades to O(n²) when the pivot selection consistently produces highly unbalanced partitions.",
    difficulty: "medium" as const,
    topic: "Algorithms",
  },
  {
    id: "q4",
    type: "true-false" as const,
    text: "A hash table guarantees O(1) lookup time in all cases.",
    options: ["True", "False"],
    correctAnswer: "False",
    explanation: "Hash tables have O(1) average case but O(n) worst case due to collisions.",
    difficulty: "medium" as const,
    topic: "Data Structures",
  },
  {
    id: "q5",
    type: "mcq" as const,
    text: "Which traversal of a binary search tree visits nodes in ascending order?",
    options: ["Pre-order", "In-order", "Post-order", "Level-order"],
    correctAnswer: "In-order",
    explanation: "In-order traversal visits left subtree, then root, then right subtree, producing sorted output for BSTs.",
    difficulty: "medium" as const,
    topic: "Trees",
  },
  {
    id: "q6",
    type: "mcq" as const,
    text: "What is the space complexity of a recursive Fibonacci implementation without memoization?",
    options: ["O(1)", "O(log n)", "O(n)", "O(2ⁿ)"],
    correctAnswer: "O(n)",
    explanation: "The call stack grows linearly with n, even though the time complexity is exponential.",
    difficulty: "hard" as const,
    topic: "Recursion",
  },
  {
    id: "q7",
    type: "mcq" as const,
    text: "Which algorithm is used to find the shortest path in a weighted graph with non-negative edges?",
    options: ["BFS", "DFS", "Dijkstra's", "Bellman-Ford"],
    correctAnswer: "Dijkstra's",
    explanation: "Dijkstra's algorithm finds shortest paths from a source to all vertices in a graph with non-negative edge weights.",
    difficulty: "medium" as const,
    topic: "Graphs",
  },
  {
    id: "q8",
    type: "mcq" as const,
    text: "What is the amortized time complexity of inserting into a dynamic array (ArrayList)?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
    correctAnswer: "O(1)",
    explanation: "While individual inserts can be O(n) when resizing, the amortized cost across all insertions is O(1).",
    difficulty: "hard" as const,
    topic: "Data Structures",
  },
];

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

interface TestResult {
  score: number;
  total: number;
  percentage: number;
  grade: string;
  timeSpent: number;
  weakTopics: string[];
}

function getGrade(pct: number): string {
  if (pct >= 97) return "A+";
  if (pct >= 93) return "A";
  if (pct >= 90) return "A-";
  if (pct >= 87) return "B+";
  if (pct >= 83) return "B";
  if (pct >= 80) return "B-";
  if (pct >= 77) return "C+";
  if (pct >= 73) return "C";
  if (pct >= 70) return "C-";
  return "F";
}

export default function TestPage() {
  const questions = DEMO_QUESTIONS;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [circled, setCircled] = useState<Set<string>>(new Set());
  const [showExplanation, setShowExplanation] = useState<string | null>(null);
  const [explanationMode, setExplanationMode] = useState<"text" | "voice" | "video">("text");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);
  const [showNav, setShowNav] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(questions.length * 120);

  const currentQuestion = questions[currentIndex];
  const progress = Object.keys(answers).length / questions.length;

  const handleAnswer = (answer: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: answer }));
  };

  const handleSubmit = useCallback(() => {
    const score = questions.filter((q) => answers[q.id]?.toLowerCase() === q.correctAnswer.toLowerCase()).length;
    const pct = Math.round((score / questions.length) * 100);
    const topicMap: Record<string, { c: number; t: number }> = {};
    questions.forEach((q) => {
      if (!topicMap[q.topic]) topicMap[q.topic] = { c: 0, t: 0 };
      topicMap[q.topic].t++;
      if (answers[q.id]?.toLowerCase() === q.correctAnswer.toLowerCase()) topicMap[q.topic].c++;
    });
    const weak = Object.entries(topicMap)
      .filter(([, v]) => v.c / v.t < 0.6)
      .map(([k]) => k);

    setResult({ score, total: questions.length, percentage: pct, grade: getGrade(pct), timeSpent: questions.length * 120 - timeRemaining, weakTopics: weak });
    setIsSubmitted(true);
  }, [answers, questions, timeRemaining]);

  useEffect(() => {
    if (isSubmitted) return;
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        const next = Math.max(0, prev - 1);
        if (next === 0) {
          window.setTimeout(() => {
            handleSubmit();
          }, 0);
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [handleSubmit, isSubmitted]);

  const toggleFlag = (id: string) => {
    setFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleCircle = (id: string) => {
    setCircled((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
    setShowExplanation((prev) => (prev === id ? null : id));
  };

  // Results view
  if (isSubmitted && result) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <nav className="sticky top-0 z-50 border-b border-white/5 bg-black/60 backdrop-blur-xl">
          <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-orange-400 font-mono font-bold">&gt;_</span>
              <span className="font-semibold">Fathom</span>
            </Link>
          </div>
        </nav>

        <main className="max-w-3xl mx-auto px-4 py-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Score card */}
            <div className="text-center mb-12">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className={`w-32 h-32 rounded-full border-4 flex items-center justify-center mx-auto mb-6 ${
                  result.percentage >= 70
                    ? "border-green-500/50 bg-green-500/10"
                    : result.percentage >= 50
                      ? "border-yellow-500/50 bg-yellow-500/10"
                      : "border-red-500/50 bg-red-500/10"
                }`}
              >
                <div>
                  <div className="text-4xl font-bold font-mono">{result.percentage}%</div>
                  <div className="text-sm text-zinc-400">{result.grade}</div>
                </div>
              </motion.div>

              <h1 className="text-2xl font-bold mb-2">Test Complete</h1>
              <p className="text-zinc-400">
                {result.score}/{result.total} correct · {formatTime(result.timeSpent)} elapsed
              </p>
            </div>

            {/* Weak areas */}
            {result.weakTopics.length > 0 && (
              <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-5 mb-8">
                <h3 className="text-sm font-semibold flex items-center gap-2 mb-3">
                  <BarChart3 className="w-4 h-4 text-orange-400" /> Areas to Improve
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.weakTopics.map((topic) => (
                    <span key={topic} className="px-3 py-1 rounded-lg bg-orange-500/10 border border-orange-500/20 text-sm text-orange-400 font-mono">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Question review */}
            <h3 className="text-lg font-semibold mb-4">Question Review</h3>
            <div className="space-y-3">
              {questions.map((q, i) => {
                const isCorrect = answers[q.id]?.toLowerCase() === q.correctAnswer.toLowerCase();
                const isCircledQ = circled.has(q.id);
                return (
                  <div key={q.id}>
                    <button
                      onClick={() => setShowExplanation((p) => (p === q.id ? null : q.id))}
                      className={`w-full text-left p-4 rounded-xl border transition-all ${
                        isCorrect
                          ? "border-green-500/20 bg-green-500/5 hover:border-green-500/30"
                          : "border-red-500/20 bg-red-500/5 hover:border-red-500/30"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {isCorrect ? (
                          <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white">Q{i + 1}: {q.text}</p>
                          <div className="flex gap-4 mt-1 text-xs">
                            <span className={isCorrect ? "text-green-400" : "text-red-400"}>
                              Your answer: {answers[q.id] || "(skipped)"}
                            </span>
                            {!isCorrect && (
                              <span className="text-green-400">Correct: {q.correctAnswer}</span>
                            )}
                          </div>
                        </div>
                        {isCircledQ && <CircleDot className="w-4 h-4 text-orange-400 shrink-0" />}
                      </div>
                    </button>

                    <AnimatePresence>
                      {showExplanation === q.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="p-4 ml-8 mt-2 rounded-xl border border-white/5 bg-white/[0.02]">
                            {/* Explanation mode tabs */}
                            <div className="flex gap-2 mb-3">
                              {[
                                { mode: "text" as const, icon: MessageSquare, label: "Text" },
                                { mode: "voice" as const, icon: Volume2, label: "Voice" },
                                { mode: "video" as const, icon: Video, label: "Video" },
                              ].map(({ mode, icon: Icon, label }) => (
                                <button
                                  key={mode}
                                  onClick={() => setExplanationMode(mode)}
                                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all ${
                                    explanationMode === mode
                                      ? "bg-orange-500/10 border border-orange-500/30 text-orange-400"
                                      : "border border-white/5 text-zinc-400 hover:text-white"
                                  }`}
                                >
                                  <Icon className="w-3 h-3" /> {label}
                                </button>
                              ))}
                            </div>
                            <p className="text-sm text-zinc-300 leading-relaxed">
                              {q.explanation}
                            </p>
                            {explanationMode === "voice" && (
                              <div className="mt-3 flex items-center gap-2 text-xs text-zinc-500">
                                <Volume2 className="w-3 h-3" />
                                Voice explanation requires API key configuration
                              </div>
                            )}
                            {explanationMode === "video" && (
                              <div className="mt-3 flex items-center gap-2 text-xs text-zinc-500">
                                <Video className="w-3 h-3" />
                                Video explanation requires Pro plan
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-8 justify-center">
              <Link
                href="/test/new"
                className="px-6 py-3 rounded-lg bg-orange-500 hover:bg-orange-400 text-black font-semibold transition-all"
              >
                Take Another Test
              </Link>
              <Link
                href="/dashboard"
                className="px-6 py-3 rounded-lg border border-white/10 hover:border-white/20 text-white transition-all"
              >
                View Dashboard
              </Link>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  // Test-taking view
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      {/* Top bar */}
      <div className="sticky top-0 z-50 border-b border-white/5 bg-black/80 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-400 font-mono">
              Q{currentIndex + 1}/{questions.length}
            </span>
            {/* Progress bar */}
            <div className="w-32 sm:w-48 h-1.5 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                className="h-full bg-orange-500 rounded-full"
                animate={{ width: `${progress * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-1.5 font-mono text-sm ${timeRemaining < 60 ? "text-red-400" : "text-zinc-400"}`}>
              <Clock className="w-4 h-4" />
              {formatTime(timeRemaining)}
            </div>
            <button
              onClick={() => setShowNav(!showNav)}
              className="p-2 rounded-lg border border-white/5 hover:border-white/10 transition-all"
            >
              <ChevronDown className={`w-4 h-4 transition-transform ${showNav ? "rotate-180" : ""}`} />
            </button>
          </div>
        </div>

        {/* Question nav dropdown */}
        <AnimatePresence>
          {showNav && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              className="overflow-hidden border-b border-white/5"
            >
              <div className="max-w-4xl mx-auto px-4 py-3">
                <div className="flex flex-wrap gap-1.5">
                  {questions.map((q, i) => (
                    <button
                      key={q.id}
                      onClick={() => { setCurrentIndex(i); setShowNav(false); }}
                      className={`w-8 h-8 rounded text-xs font-mono flex items-center justify-center border transition-all ${
                        i === currentIndex
                          ? "bg-orange-500 border-orange-500 text-black"
                          : answers[q.id]
                            ? "bg-green-500/10 border-green-500/30 text-green-400"
                            : flagged.has(q.id)
                              ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-400"
                              : "border-white/10 text-zinc-400 hover:border-white/20"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Question content */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Question header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className={`px-2 py-0.5 rounded text-xs font-mono border ${
                  currentQuestion.difficulty === "easy"
                    ? "border-green-500/30 text-green-400 bg-green-500/10"
                    : currentQuestion.difficulty === "medium"
                      ? "border-yellow-500/30 text-yellow-400 bg-yellow-500/10"
                      : "border-red-500/30 text-red-400 bg-red-500/10"
                }`}>
                  {currentQuestion.difficulty}
                </span>
                <span className="text-xs text-zinc-500 font-mono">{currentQuestion.topic}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleFlag(currentQuestion.id)}
                  className={`p-2 rounded-lg border transition-all ${
                    flagged.has(currentQuestion.id)
                      ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-400"
                      : "border-white/5 text-zinc-500 hover:text-white"
                  }`}
                  title="Flag for review"
                >
                  <Flag className="w-4 h-4" />
                </button>
                <button
                  onClick={() => toggleCircle(currentQuestion.id)}
                  className={`p-2 rounded-lg border transition-all ${
                    circled.has(currentQuestion.id)
                      ? "border-orange-500/30 bg-orange-500/10 text-orange-400"
                      : "border-white/5 text-zinc-500 hover:text-white"
                  }`}
                  title="Circle for AI explanation"
                >
                  <CircleDot className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Question text */}
            <h2 className="text-xl sm:text-2xl font-semibold mb-8 leading-relaxed">
              {currentQuestion.text}
            </h2>

            {/* Answer options */}
            {currentQuestion.options && (
              <div className="space-y-3">
                {currentQuestion.options.map((option, i) => {
                  const letter = String.fromCharCode(65 + i);
                  const isSelected = answers[currentQuestion.id] === option;
                  return (
                    <button
                      key={option}
                      onClick={() => handleAnswer(option)}
                      className={`w-full text-left p-4 rounded-xl border transition-all flex items-center gap-4 ${
                        isSelected
                          ? "border-orange-500/50 bg-orange-500/10"
                          : "border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04]"
                      }`}
                    >
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-mono border ${
                        isSelected
                          ? "bg-orange-500 border-orange-500 text-black"
                          : "border-white/10 text-zinc-400"
                      }`}>
                        {letter}
                      </span>
                      <span className={isSelected ? "text-white" : "text-zinc-300"}>{option}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Free response */}
            {currentQuestion.type === "free-response" && (
              <textarea
                value={answers[currentQuestion.id] || ""}
                onChange={(e) => handleAnswer(e.target.value)}
                placeholder="Type your answer..."
                className="w-full h-32 p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 resize-none focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 transition-all"
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom navigation */}
      <div className="sticky bottom-0 border-t border-white/5 bg-black/80 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-white/5 text-sm text-zinc-400 hover:text-white hover:border-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Previous
          </button>

          <div className="text-xs text-zinc-500 font-mono">
            {Object.keys(answers).length}/{questions.length} answered
            {flagged.size > 0 && ` · ${flagged.size} flagged`}
          </div>

          {currentIndex === questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              className="flex items-center gap-1.5 px-6 py-2 rounded-lg bg-orange-500 hover:bg-orange-400 text-black text-sm font-semibold transition-all"
            >
              Submit Test
            </button>
          ) : (
            <button
              onClick={() => setCurrentIndex(Math.min(questions.length - 1, currentIndex + 1))}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-400 text-black text-sm font-semibold transition-all"
            >
              Next <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
