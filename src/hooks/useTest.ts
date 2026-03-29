"use client";

import { useState, useCallback, useRef, useEffect } from "react";

interface Question {
  id: string;
  type: "mcq" | "free-response" | "true-false";
  text: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  difficulty: "easy" | "medium" | "hard";
  topic: string;
  source?: string;
}

interface TestState {
  questions: Question[];
  currentIndex: number;
  answers: Record<string, string>;
  flagged: Set<string>;
  circled: Set<string>;
  timeLimit: number;
  timeRemaining: number;
  isSubmitted: boolean;
}

interface TestResult {
  score: number;
  total: number;
  percentage: number;
  grade: string;
  timeSpent: number;
  questionResults: Array<{
    questionId: string;
    correct: boolean;
    userAnswer: string;
    correctAnswer: string;
  }>;
  weakTopics: string[];
}

function getGrade(percentage: number): string {
  if (percentage >= 97) return "A+";
  if (percentage >= 93) return "A";
  if (percentage >= 90) return "A-";
  if (percentage >= 87) return "B+";
  if (percentage >= 83) return "B";
  if (percentage >= 80) return "B-";
  if (percentage >= 77) return "C+";
  if (percentage >= 73) return "C";
  if (percentage >= 70) return "C-";
  if (percentage >= 67) return "D+";
  if (percentage >= 63) return "D";
  if (percentage >= 60) return "D-";
  return "F";
}

export function useTest(questions: Question[], timeLimitMinutes: number = 60) {
  const [state, setState] = useState<TestState>({
    questions,
    currentIndex: 0,
    answers: {},
    flagged: new Set(),
    circled: new Set(),
    timeLimit: timeLimitMinutes * 60,
    timeRemaining: timeLimitMinutes * 60,
    isSubmitted: false,
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (state.isSubmitted) return;

    timerRef.current = setInterval(() => {
      setState((prev) => {
        const remaining = Math.max(0, prev.timeRemaining - 1);
        if (remaining === 0) {
          return { ...prev, timeRemaining: 0, isSubmitted: true };
        }
        return { ...prev, timeRemaining: remaining };
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state.isSubmitted]);

  const setAnswer = useCallback((questionId: string, answer: string) => {
    setState((prev) => ({
      ...prev,
      answers: { ...prev.answers, [questionId]: answer },
    }));
  }, []);

  const goToQuestion = useCallback((index: number) => {
    setState((prev) => ({
      ...prev,
      currentIndex: Math.max(0, Math.min(index, prev.questions.length - 1)),
    }));
  }, []);

  const nextQuestion = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentIndex: Math.min(prev.currentIndex + 1, prev.questions.length - 1),
    }));
  }, []);

  const prevQuestion = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentIndex: Math.max(prev.currentIndex - 1, 0),
    }));
  }, []);

  const toggleFlag = useCallback((questionId: string) => {
    setState((prev) => {
      const next = new Set(prev.flagged);
      if (next.has(questionId)) {
        next.delete(questionId);
      } else {
        next.add(questionId);
      }
      return { ...prev, flagged: next };
    });
  }, []);

  const toggleCircle = useCallback((questionId: string) => {
    setState((prev) => {
      const next = new Set(prev.circled);
      if (next.has(questionId)) {
        next.delete(questionId);
      } else {
        next.add(questionId);
      }
      return { ...prev, circled: next };
    });
  }, []);

  const submitTest = useCallback((): TestResult => {
    if (timerRef.current) clearInterval(timerRef.current);

    const questionResults = state.questions.map((q) => ({
      questionId: q.id,
      correct: state.answers[q.id]?.toLowerCase() === q.correctAnswer.toLowerCase(),
      userAnswer: state.answers[q.id] || "",
      correctAnswer: q.correctAnswer,
    }));

    const score = questionResults.filter((r) => r.correct).length;
    const percentage = Math.round((score / state.questions.length) * 100);

    const topicScores: Record<string, { correct: number; total: number }> = {};
    state.questions.forEach((q, i) => {
      if (!topicScores[q.topic]) {
        topicScores[q.topic] = { correct: 0, total: 0 };
      }
      topicScores[q.topic].total += 1;
      if (questionResults[i].correct) {
        topicScores[q.topic].correct += 1;
      }
    });

    const weakTopics = Object.entries(topicScores)
      .filter(([, stats]) => stats.correct / stats.total < 0.6)
      .map(([topic]) => topic);

    const result: TestResult = {
      score,
      total: state.questions.length,
      percentage,
      grade: getGrade(percentage),
      timeSpent: state.timeLimit - state.timeRemaining,
      questionResults,
      weakTopics,
    };

    setState((prev) => ({ ...prev, isSubmitted: true }));

    return result;
  }, [state]);

  const currentQuestion = state.questions[state.currentIndex];
  const progress = Object.keys(state.answers).length / state.questions.length;

  return {
    currentQuestion,
    currentIndex: state.currentIndex,
    totalQuestions: state.questions.length,
    answers: state.answers,
    flagged: state.flagged,
    circled: state.circled,
    timeRemaining: state.timeRemaining,
    isSubmitted: state.isSubmitted,
    progress,
    setAnswer,
    goToQuestion,
    nextQuestion,
    prevQuestion,
    toggleFlag,
    toggleCircle,
    submitTest,
  };
}
