"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ArrowRight,
  Loader2,
  FileText,
  Sparkles,
  Settings2,
  ArrowLeft,
  Shuffle,
  RotateCcw,
} from "lucide-react";
import Link from "next/link";
import { useAI } from "@/hooks/useAI";

type Step = "search" | "configure" | "generating" | "ready";

export default function NewTestPage() {
  const [step, setStep] = useState<Step>("search");
  const [testName, setTestName] = useState("");
  const [numberOfQuestions, setNumberOfQuestions] = useState(25);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard" | "mixed">("mixed");
  const [generateNew, setGenerateNew] = useState(true);
  const { searchTests, generateTest, isSearching, generatedTest, searchResults, error } =
    useAI();

  const handleSearch = async () => {
    if (!testName.trim()) return;
    const result = await searchTests(testName);
    if (result) {
      setStep("configure");
    }
  };

  const handleGenerate = async () => {
    if (!searchResults) return;
    setStep("generating");
    const test = await generateTest({
      testName,
      numberOfQuestions,
      difficulty,
      questionTypes: ["mcq", "true-false", "free-response"],
      scrapedContent: searchResults.content,
      generateNew,
    });
    if (test) {
      setStep("ready");
    } else {
      setStep("configure");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-black/60 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-orange-400 font-mono font-bold">&gt;_</span>
            <span className="font-semibold">Fathom</span>
          </Link>
          <Link href="/dashboard" className="text-sm text-zinc-400 hover:text-white transition-colors">
            Dashboard
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-16">
        {/* Progress steps */}
        <div className="flex items-center justify-center gap-2 mb-12">
          {["search", "configure", "generating", "ready"].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono border ${
                  step === s
                    ? "bg-orange-500 border-orange-500 text-black"
                    : ["search", "configure", "generating", "ready"].indexOf(step) > i
                      ? "bg-orange-500/20 border-orange-500/30 text-orange-400"
                      : "border-white/10 text-zinc-500"
                }`}
              >
                {i + 1}
              </div>
              {i < 3 && (
                <div
                  className={`w-12 h-px ${
                    ["search", "configure", "generating", "ready"].indexOf(step) > i
                      ? "bg-orange-500/30"
                      : "bg-white/10"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Search */}
          {step === "search" && (
            <motion.div
              key="search"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <div className="mb-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-mono">
                <Search className="w-3 h-3" />
                SEARCH
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-3">
                What test are you preparing for?
              </h1>
              <p className="text-zinc-400 mb-8 max-w-md mx-auto">
                Enter any exam — SAT, AP tests, MCAT, bar exam, coding interviews, certifications, or any subject.
              </p>

              <div className="relative max-w-xl mx-auto mb-4">
                <input
                  type="text"
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder='e.g., "AP Computer Science A 2025"'
                  className="w-full px-5 py-4 pr-14 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 font-mono text-base focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 transition-all"
                  autoFocus
                />
                <button
                  onClick={handleSearch}
                  disabled={isSearching || !testName.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-lg bg-orange-500 hover:bg-orange-400 disabled:bg-zinc-700 disabled:cursor-not-allowed text-black transition-all"
                >
                  {isSearching ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <ArrowRight className="w-5 h-5" />
                  )}
                </button>
              </div>

              {isSearching && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-8"
                >
                  <div className="max-w-md mx-auto rounded-xl border border-white/5 bg-black/60 p-4 font-mono text-sm text-left">
                    <div className="text-green-400 mb-1">$ fathom search &quot;{testName}&quot;</div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-orange-400"
                    >
                      [ SCANNING ] Crawling sources...
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                      className="text-zinc-500 mt-1"
                    >
                      <span className="text-orange-300">████████░░░░░░░░</span> searching...
                    </motion.div>
                  </div>
                </motion.div>
              )}

              {error && (
                <p className="mt-4 text-sm text-red-400">{error}</p>
              )}

              {/* Popular tests */}
              <div className="mt-12">
                <p className="text-xs text-zinc-500 mb-3 font-mono">POPULAR TESTS</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {["SAT Math", "AP Chemistry", "MCAT Biology", "AWS Solutions Architect", "LeetCode Easy", "Bar Exam", "GRE Verbal", "USMLE Step 1"].map((test) => (
                    <button
                      key={test}
                      onClick={() => setTestName(test)}
                      className="px-3 py-1.5 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10 text-sm text-zinc-400 transition-all"
                    >
                      {test}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Configure */}
          {step === "configure" && searchResults && (
            <motion.div
              key="configure"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <button
                onClick={() => setStep("search")}
                className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors mb-6"
              >
                <ArrowLeft className="w-4 h-4" /> Back to search
              </button>

              <div className="mb-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-mono">
                <Settings2 className="w-3 h-3" />
                CONFIGURE
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">Configure Your Mock Test</h1>
              <p className="text-zinc-400 mb-8">
                Found <span className="text-orange-400 font-mono">{searchResults.questionCount}</span> questions from{" "}
                <span className="text-orange-400 font-mono">{searchResults.sources.length}</span> sources
              </p>

              {/* Sources preview */}
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 mb-8">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-orange-400" /> Sources Found
                </h3>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {searchResults.sources.slice(0, 5).map((source, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <span className="text-zinc-500 font-mono text-xs w-5">{i + 1}.</span>
                      <span className="text-zinc-300 truncate">{source.title}</span>
                    </div>
                  ))}
                  {searchResults.sources.length > 5 && (
                    <p className="text-xs text-zinc-500 pl-7">
                      +{searchResults.sources.length - 5} more sources
                    </p>
                  )}
                </div>
              </div>

              {/* Config options */}
              <div className="space-y-6">
                {/* Number of questions */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Number of Questions</label>
                  <div className="flex gap-2">
                    {[10, 25, 50, 75, 100].map((n) => (
                      <button
                        key={n}
                        onClick={() => setNumberOfQuestions(n)}
                        className={`flex-1 py-2.5 rounded-lg border text-sm font-mono transition-all ${
                          numberOfQuestions === n
                            ? "border-orange-500/50 bg-orange-500/10 text-orange-400"
                            : "border-white/5 bg-white/[0.02] text-zinc-400 hover:border-white/10"
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Difficulty */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Difficulty</label>
                  <div className="flex gap-2">
                    {(["easy", "medium", "hard", "mixed"] as const).map((d) => (
                      <button
                        key={d}
                        onClick={() => setDifficulty(d)}
                        className={`flex-1 py-2.5 rounded-lg border text-sm capitalize transition-all ${
                          difficulty === d
                            ? "border-orange-500/50 bg-orange-500/10 text-orange-400"
                            : "border-white/5 bg-white/[0.02] text-zinc-400 hover:border-white/10"
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Generation mode */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Question Source</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setGenerateNew(true)}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        generateNew
                          ? "border-orange-500/50 bg-orange-500/10"
                          : "border-white/5 bg-white/[0.02] hover:border-white/10"
                      }`}
                    >
                      <Sparkles className={`w-5 h-5 mb-2 ${generateNew ? "text-orange-400" : "text-zinc-500"}`} />
                      <div className={`text-sm font-medium ${generateNew ? "text-orange-400" : "text-zinc-300"}`}>
                        Generate New
                      </div>
                      <p className="text-xs text-zinc-500 mt-1">
                        AI creates new problems based on real exam patterns
                      </p>
                    </button>
                    <button
                      onClick={() => setGenerateNew(false)}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        !generateNew
                          ? "border-orange-500/50 bg-orange-500/10"
                          : "border-white/5 bg-white/[0.02] hover:border-white/10"
                      }`}
                    >
                      <RotateCcw className={`w-5 h-5 mb-2 ${!generateNew ? "text-orange-400" : "text-zinc-500"}`} />
                      <div className={`text-sm font-medium ${!generateNew ? "text-orange-400" : "text-zinc-300"}`}>
                        Cycle Real Questions
                      </div>
                      <p className="text-xs text-zinc-500 mt-1">
                        Practice with actual past exam questions
                      </p>
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={handleGenerate}
                className="w-full mt-8 py-3.5 rounded-lg bg-orange-500 hover:bg-orange-400 text-black font-semibold transition-all shadow-[0_0_20px_rgba(250,93,25,0.3)] hover:shadow-[0_0_30px_rgba(250,93,25,0.5)] flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Generate Mock Test
              </button>
            </motion.div>
          )}

          {/* Step 3: Generating */}
          {step === "generating" && (
            <motion.div
              key="generating"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-12"
            >
              <div className="max-w-md mx-auto">
                <div className="rounded-xl border border-white/5 bg-black/60 p-6 font-mono text-sm text-left mb-8">
                  <div className="flex items-center gap-1.5 mb-4">
                    <div className="w-2 h-2 rounded-full bg-red-500/60" />
                    <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
                    <div className="w-2 h-2 rounded-full bg-green-500/60" />
                    <span className="ml-2 text-xs text-zinc-500">generating test</span>
                  </div>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-green-400">
                    $ fathom generate --questions {numberOfQuestions}
                  </motion.div>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-orange-400 mt-2">
                    [ ANALYZE  ] Processing scraped content...
                  </motion.div>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="text-orange-400 mt-1">
                    [ GENERATE ] Creating {numberOfQuestions} questions...
                  </motion.div>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }} className="text-amber-300 mt-1">
                    [ VALIDATE ] Checking answer accuracy...
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ delay: 2.5, repeat: Infinity, duration: 1.5 }}
                    className="text-zinc-500 mt-2"
                  >
                    <span className="text-orange-300">████████████░░░░</span> generating...
                  </motion.div>
                </div>

                <Loader2 className="w-6 h-6 text-orange-400 animate-spin mx-auto mb-4" />
                <p className="text-zinc-400 text-sm">
                  Generating your mock test... This usually takes 10-20 seconds.
                </p>
              </div>
            </motion.div>
          )}

          {/* Step 4: Ready */}
          {step === "ready" && generatedTest && (
            <motion.div
              key="ready"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-6"
              >
                <FileText className="w-8 h-8 text-green-400" />
              </motion.div>

              <h1 className="text-2xl sm:text-3xl font-bold mb-2">Your Test is Ready!</h1>
              <p className="text-zinc-400 mb-8">
                <span className="text-orange-400 font-mono">{generatedTest.questions.length}</span> questions generated
                from <span className="text-orange-400 font-mono">{generatedTest.metadata.sourceCount}</span> sources
              </p>

              {/* Test summary */}
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6 mb-8 text-left max-w-md mx-auto">
                <h3 className="font-semibold mb-4">{generatedTest.name}</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-zinc-500">Questions</span>
                    <p className="text-white font-mono">{generatedTest.questions.length}</p>
                  </div>
                  <div>
                    <span className="text-zinc-500">Difficulty</span>
                    <p className="text-white capitalize font-mono">{difficulty}</p>
                  </div>
                  <div>
                    <span className="text-zinc-500">Mode</span>
                    <p className="text-white font-mono">{generateNew ? "AI Generated" : "Past Exams"}</p>
                  </div>
                  <div>
                    <span className="text-zinc-500">Time Limit</span>
                    <p className="text-white font-mono">{numberOfQuestions * 2} min</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href={`/test/${generatedTest.id}`}
                  className="px-8 py-3.5 rounded-lg bg-orange-500 hover:bg-orange-400 text-black font-semibold transition-all shadow-[0_0_20px_rgba(250,93,25,0.3)] inline-flex items-center justify-center gap-2"
                >
                  Start Test <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => setStep("configure")}
                  className="px-8 py-3.5 rounded-lg border border-white/10 hover:border-white/20 text-white transition-all inline-flex items-center justify-center gap-2"
                >
                  <Shuffle className="w-4 h-4" /> Regenerate
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
