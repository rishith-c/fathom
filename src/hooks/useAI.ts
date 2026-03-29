"use client";

import { useState, useCallback } from "react";

interface SearchResult {
  testName: string;
  sources: Array<{ title: string; url: string }>;
  questionCount: number;
  content: string;
}

interface GeneratedTest {
  id: string;
  name: string;
  questions: Array<{
    id: string;
    type: "mcq" | "free-response" | "true-false";
    text: string;
    options?: string[];
    correctAnswer: string;
    explanation?: string;
    difficulty: "easy" | "medium" | "hard";
    topic: string;
    source?: string;
  }>;
  metadata: {
    generatedAt: string;
    sourceCount: number;
    questionCount: number;
  };
}

interface Explanation {
  questionId: string;
  text: string;
  steps: Array<{ step: number; title: string; content: string }>;
  keyConcepte: string[];
  difficulty: string;
  voiceText?: string;
  videoSteps?: Array<{ timestamp: string; visual: string; narration: string }>;
}

interface UseAIState {
  isSearching: boolean;
  isGenerating: boolean;
  isExplaining: boolean;
  searchResults: SearchResult | null;
  generatedTest: GeneratedTest | null;
  explanation: Explanation | null;
  streamedText: string;
  error: string | null;
}

export function useAI() {
  const [state, setState] = useState<UseAIState>({
    isSearching: false,
    isGenerating: false,
    isExplaining: false,
    searchResults: null,
    generatedTest: null,
    explanation: null,
    streamedText: "",
    error: null,
  });

  const searchTests = useCallback(async (testName: string) => {
    setState((prev) => ({ ...prev, isSearching: true, error: null, searchResults: null }));

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testName }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Search failed");
      }

      const data = await res.json();
      setState((prev) => ({ ...prev, isSearching: false, searchResults: data.data }));
      return data.data as SearchResult;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Search failed";
      setState((prev) => ({ ...prev, isSearching: false, error: message }));
      return null;
    }
  }, []);

  const generateTest = useCallback(
    async (config: {
      testName: string;
      numberOfQuestions: number;
      difficulty: "easy" | "medium" | "hard" | "mixed";
      questionTypes: string[];
      scrapedContent: string;
      generateNew: boolean;
    }) => {
      setState((prev) => ({ ...prev, isGenerating: true, error: null, generatedTest: null }));

      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(config),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Generation failed");
        }

        const data = await res.json();
        setState((prev) => ({ ...prev, isGenerating: false, generatedTest: data.data }));
        return data.data as GeneratedTest;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Generation failed";
        setState((prev) => ({ ...prev, isGenerating: false, error: message }));
        return null;
      }
    },
    []
  );

  const explainQuestion = useCallback(
    async (
      question: { id: string; text: string; options?: string[]; correctAnswer: string },
      userAnswer?: string,
      mode: "text" | "voice" | "video" = "text"
    ) => {
      setState((prev) => ({
        ...prev,
        isExplaining: true,
        error: null,
        explanation: null,
        streamedText: "",
      }));

      try {
        const res = await fetch("/api/explain", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question, userAnswer, mode }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Explanation failed");
        }

        if (mode === "text" && res.body) {
          const reader = res.body.getReader();
          const decoder = new TextDecoder();
          let fullText = "";

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            fullText += chunk;
            setState((prev) => ({ ...prev, streamedText: fullText }));
          }

          const explanation: Explanation = {
            questionId: question.id,
            text: fullText,
            steps: [],
            keyConcepte: [],
            difficulty: "",
          };
          setState((prev) => ({ ...prev, isExplaining: false, explanation }));
          return explanation;
        }

        const data = await res.json();
        setState((prev) => ({ ...prev, isExplaining: false, explanation: data.data }));
        return data.data as Explanation;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Explanation failed";
        setState((prev) => ({ ...prev, isExplaining: false, error: message }));
        return null;
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const reset = useCallback(() => {
    setState({
      isSearching: false,
      isGenerating: false,
      isExplaining: false,
      searchResults: null,
      generatedTest: null,
      explanation: null,
      streamedText: "",
      error: null,
    });
  }, []);

  return {
    ...state,
    searchTests,
    generateTest,
    explainQuestion,
    clearError,
    reset,
  };
}
