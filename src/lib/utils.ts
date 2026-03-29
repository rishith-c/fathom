import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import type { Answer, Question } from "@/types";

/**
 * Merge Tailwind CSS classes with conflict resolution.
 * Combines clsx for conditional classes with tailwind-merge
 * to handle conflicting utility classes.
 */
export function cn(...inputs: ReadonlyArray<ClassValue>): string {
  return twMerge(clsx(inputs));
}

/**
 * Format a duration in seconds to mm:ss display format.
 * @param seconds - Total seconds to format
 * @returns Formatted string like "05:30"
 */
export function formatTime(seconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

/**
 * Format a duration in seconds to a human-readable string.
 * @param seconds - Total seconds to format
 * @returns Formatted string like "2h 15m" or "45m" or "30s"
 */
export function formatDuration(seconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(seconds));

  if (safeSeconds < 60) {
    return `${safeSeconds}s`;
  }

  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);

  if (hours === 0) {
    return `${minutes}m`;
  }

  return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
}

/**
 * Format a date string into a localized display format.
 * @param dateString - ISO date string or Date-compatible string
 * @param options - Intl.DateTimeFormat options for customization
 * @returns Formatted date string
 */
export function formatDate(
  dateString: string,
  options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  },
): string {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  return new Intl.DateTimeFormat("en-US", options).format(date);
}

/**
 * Format a date as a relative time string (e.g., "2 hours ago").
 * @param dateString - ISO date string
 * @returns Relative time string
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  const now = Date.now();
  const diffMs = now - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) {
    return "just now";
  }
  if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  }
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }
  if (diffDays < 7) {
    return `${diffDays}d ago`;
  }

  return formatDate(dateString);
}

/**
 * Generate a unique ID using crypto.randomUUID with a prefix.
 * @param prefix - Optional prefix for the ID (e.g., "q" for question, "t" for test)
 * @returns A unique string ID
 */
export function generateId(prefix?: string): string {
  const uuid = crypto.randomUUID();
  return prefix ? `${prefix}_${uuid}` : uuid;
}

/**
 * Immutable Fisher-Yates shuffle. Returns a new array without mutating the original.
 * @param array - The array to shuffle
 * @returns A new shuffled array
 */
export function shuffleArray<T>(array: ReadonlyArray<T>): ReadonlyArray<T> {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = shuffled[i];
    shuffled[i] = shuffled[j]!;
    shuffled[j] = temp!;
  }
  return shuffled;
}

/**
 * Calculate the score from a set of answers against questions.
 * @param answers - Array of user answers
 * @param questions - Array of questions with point values
 * @returns Object containing score, total, and percentage
 */
export function calculateScore(
  answers: ReadonlyArray<Answer>,
  questions: ReadonlyArray<Question>,
): {
  readonly score: number;
  readonly totalPoints: number;
  readonly percentage: number;
  readonly correctCount: number;
  readonly incorrectCount: number;
  readonly skippedCount: number;
} {
  const questionMap = new Map(questions.map((q) => [q.id, q]));

  let score = 0;
  let totalPoints = 0;
  let correctCount = 0;
  let incorrectCount = 0;
  let skippedCount = 0;

  for (const answer of answers) {
    const question = questionMap.get(answer.questionId);
    if (!question) continue;

    totalPoints += question.points;

    if (answer.skipped) {
      skippedCount++;
    } else if (answer.isCorrect) {
      score += question.points;
      correctCount++;
    } else {
      incorrectCount++;
    }
  }

  const percentage = totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0;

  return {
    score,
    totalPoints,
    percentage,
    correctCount,
    incorrectCount,
    skippedCount,
  };
}

/**
 * Get a letter grade from a percentage score.
 * @param percentage - Score percentage (0-100)
 * @returns Letter grade string
 */
export function getGrade(percentage: number): string {
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

/**
 * Truncate text to a maximum length with an ellipsis.
 * @param text - The text to truncate
 * @param maxLength - Maximum character count before truncation
 * @returns Truncated string with ellipsis if needed
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }

  const truncated = text.slice(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(" ");

  if (lastSpaceIndex > maxLength * 0.7) {
    return `${truncated.slice(0, lastSpaceIndex)}...`;
  }

  return `${truncated}...`;
}

/**
 * Create a debounced version of a function.
 * @param fn - The function to debounce
 * @param delayMs - Delay in milliseconds
 * @returns A debounced function with a cancel method
 */
export function debounce<T extends (...args: ReadonlyArray<unknown>) => void>(
  fn: T,
  delayMs: number,
): T & { cancel: () => void } {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const debounced = ((...args: ReadonlyArray<unknown>) => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn(...args);
      timeoutId = null;
    }, delayMs);
  }) as T & { cancel: () => void };

  debounced.cancel = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return debounced;
}

/**
 * Clamp a number between a minimum and maximum value.
 * @param value - The value to clamp
 * @param min - Minimum bound
 * @param max - Maximum bound
 * @returns Clamped value
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Calculate a percentage, safely handling division by zero.
 * @param value - The numerator
 * @param total - The denominator
 * @returns Percentage (0-100), or 0 if total is 0
 */
export function percentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

/**
 * Pluralize a word based on count.
 * @param count - The count to check
 * @param singular - Singular form
 * @param plural - Plural form (defaults to singular + "s")
 * @returns Formatted string like "3 questions" or "1 question"
 */
export function pluralize(
  count: number,
  singular: string,
  plural?: string,
): string {
  const form = count === 1 ? singular : (plural ?? `${singular}s`);
  return `${count} ${form}`;
}

/**
 * Get an error message from an unknown error value.
 * @param error - The caught error value
 * @returns A user-safe error message string
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  return "An unexpected error occurred";
}
