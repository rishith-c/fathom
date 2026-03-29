/* ============================================
   Fathom - Type Definitions
   Full type system for the AI-powered test prep platform
   ============================================ */

// --- Question Types ---

export type QuestionType =
  | "mcq"
  | "multiple-select"
  | "true-false"
  | "free-response"
  | "fill-in-the-blank"
  | "matching"
  | "ordering";

export type DifficultyLevel = "easy" | "medium" | "hard" | "expert";

export type ExplanationMode = "text" | "voice" | "video";

export interface QuestionOption {
  readonly id: string;
  readonly label: string;
  readonly text: string;
}

export interface MatchingPair {
  readonly id: string;
  readonly left: string;
  readonly right: string;
}

export interface Question {
  readonly id: string;
  readonly type: QuestionType;
  readonly text: string;
  readonly options?: ReadonlyArray<QuestionOption | string>;
  readonly matchingPairs: ReadonlyArray<MatchingPair> | null;
  readonly correctAnswer: string | ReadonlyArray<string>;
  readonly explanation?: string;
  readonly difficulty: DifficultyLevel | Difficulty;
  readonly topic: string;
  readonly subtopic: string | null;
  readonly tags: ReadonlyArray<string>;
  readonly timeEstimateSeconds: number;
  readonly points: number;
  readonly source?: string | null;
}

// --- Answer Types ---

export interface Answer {
  readonly questionId: string;
  readonly selectedAnswer: string | ReadonlyArray<string>;
  readonly isCorrect: boolean;
  readonly timeSpentSeconds: number;
  readonly flagged: boolean;
  readonly skipped: boolean;
}

// --- Test Types ---

export type TestStatus =
  | "not-started"
  | "in-progress"
  | "paused"
  | "completed"
  | "abandoned";

export interface TestConfig {
  readonly questionCount: number;
  readonly timeLimitMinutes: number | null;
  readonly difficulty: DifficultyLevel | "mixed";
  readonly questionTypes: ReadonlyArray<QuestionType>;
  readonly topics: ReadonlyArray<string>;
  readonly shuffleQuestions: boolean;
  readonly shuffleOptions: boolean;
  readonly showExplanations: boolean;
  readonly allowSkip: boolean;
  readonly allowFlag: boolean;
  readonly allowReview: boolean;
  readonly passingScore: number;
}

export interface Test {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly subject: string;
  readonly config: TestConfig;
  readonly questions: ReadonlyArray<Question>;
  readonly status: TestStatus;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface TestSession {
  readonly id: string;
  readonly testId: string;
  readonly userId: string;
  readonly answers: ReadonlyArray<Answer>;
  readonly currentQuestionIndex: number;
  readonly startedAt: string;
  readonly pausedAt: string | null;
  readonly completedAt: string | null;
  readonly elapsedSeconds: number;
  readonly status: TestStatus;
}

export interface TestResult {
  readonly id: string;
  readonly testId: string;
  readonly sessionId: string;
  readonly userId: string;
  readonly score: number;
  readonly totalPoints: number;
  readonly percentage: number;
  readonly grade: string;
  readonly passed: boolean;
  readonly correctCount: number;
  readonly incorrectCount: number;
  readonly skippedCount: number;
  readonly flaggedCount: number;
  readonly totalTimeSeconds: number;
  readonly averageTimePerQuestion: number;
  readonly answers: ReadonlyArray<Answer>;
  readonly topicBreakdown: ReadonlyArray<TopicScore>;
  readonly completedAt: string;
}

export interface TopicScore {
  readonly topic: string;
  readonly correct: number;
  readonly total: number;
  readonly percentage: number;
}

// --- Explanation Types ---

export interface Explanation {
  readonly questionId: string;
  readonly mode?: ExplanationMode;
  readonly text?: string;
  readonly textContent?: string;
  readonly voiceUrl?: string | null;
  readonly videoUrl?: string | null;
  readonly relatedConcepts?: ReadonlyArray<string>;
  readonly furtherReading?: ReadonlyArray<ResourceLink>;
}

export interface ResourceLink {
  readonly title: string;
  readonly url: string;
  readonly type: "article" | "video" | "documentation" | "practice";
}

// --- API Types ---

export interface ApiResponse<T> {
  readonly success: boolean;
  readonly data?: T | null;
  readonly error?: string | null;
  readonly meta?: ApiMeta | null;
}

export interface ApiMeta {
  readonly total?: number;
  readonly page?: number;
  readonly limit?: number;
  readonly hasMore?: boolean;
  readonly requestId?: string;
  readonly durationMs?: number;
}

export interface ApiError {
  readonly code: string;
  readonly message: string;
  readonly details: Record<string, unknown> | null;
}

// --- User Types ---

export type SubscriptionTier = "free" | "pro" | "team";

export interface UserProfile {
  readonly id: string;
  readonly email: string;
  readonly displayName: string;
  readonly avatarUrl: string | null;
  readonly subscriptionTier: SubscriptionTier;
  readonly subjects: ReadonlyArray<string>;
  readonly preferredDifficulty: DifficultyLevel;
  readonly preferredExplanationMode: ExplanationMode;
  readonly dailyGoalMinutes: number;
  readonly timezone: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface StudyProgress {
  readonly userId: string;
  readonly subject: string;
  readonly totalQuestionsAttempted: number;
  readonly totalCorrect: number;
  readonly accuracy: number;
  readonly totalTimeSeconds: number;
  readonly topicMastery: ReadonlyArray<TopicMastery>;
  readonly recentActivity: ReadonlyArray<ActivityEntry>;
  readonly lastStudiedAt: string;
}

export interface TopicMastery {
  readonly topic: string;
  readonly mastery: number;
  readonly questionsAttempted: number;
  readonly accuracy: number;
  readonly trend: "improving" | "stable" | "declining";
}

export interface ActivityEntry {
  readonly date: string;
  readonly questionsAttempted: number;
  readonly correctAnswers: number;
  readonly timeSpentSeconds: number;
  readonly testsCompleted: number;
}

export interface TestHistory {
  readonly userId: string;
  readonly entries: ReadonlyArray<TestHistoryEntry>;
  readonly totalTestsTaken: number;
  readonly averageScore: number;
  readonly bestScore: number;
  readonly totalTimeSpentSeconds: number;
}

export interface TestHistoryEntry {
  readonly testId: string;
  readonly title: string;
  readonly subject: string;
  readonly score: number;
  readonly percentage: number;
  readonly grade: string;
  readonly passed: boolean;
  readonly questionCount: number;
  readonly timeSpentSeconds: number;
  readonly completedAt: string;
}

// --- Generation Types ---

export type GenerationStatus =
  | "idle"
  | "generating"
  | "streaming"
  | "complete"
  | "error";

export type GenerationSource = "ai" | "manual" | "imported";

export interface GenerationRequest {
  readonly source: string;
  readonly sourceType: "text" | "url" | "pdf" | "image" | "notes";
  readonly subject: string;
  readonly topics: ReadonlyArray<string>;
  readonly questionCount: number;
  readonly questionTypes: ReadonlyArray<QuestionType>;
  readonly difficulty: DifficultyLevel | "mixed";
  readonly additionalInstructions: string | null;
  readonly language: string;
}

export interface GenerationResult {
  readonly id: string;
  readonly request: GenerationRequest;
  readonly questions: ReadonlyArray<Question>;
  readonly status: GenerationStatus;
  readonly generatedAt: string;
  readonly generationTimeMs: number;
  readonly tokenUsage: TokenUsage;
  readonly source: GenerationSource;
}

export interface TokenUsage {
  readonly inputTokens: number;
  readonly outputTokens: number;
  readonly totalTokens: number;
}

export interface GenerationStreamEvent {
  readonly type: "progress" | "question" | "complete" | "error";
  readonly progress: number | null;
  readonly question: Question | null;
  readonly message: string | null;
}

// --- Dashboard Types ---

export interface DashboardStats {
  readonly totalTestsTaken: number;
  readonly totalQuestionsAnswered: number;
  readonly overallAccuracy: number;
  readonly currentStreak: StudyStreak;
  readonly todayProgress: DailyProgress;
  readonly weeklyProgress: ReadonlyArray<DailyProgress>;
  readonly weakAreas: ReadonlyArray<WeakArea>;
  readonly recentTests: ReadonlyArray<TestHistoryEntry>;
  readonly subjectBreakdown: ReadonlyArray<SubjectStat>;
}

export interface StudyStreak {
  readonly currentDays: number;
  readonly longestDays: number;
  readonly lastStudiedDate: string;
  readonly isActiveToday: boolean;
}

export interface DailyProgress {
  readonly date: string;
  readonly questionsAttempted: number;
  readonly correctAnswers: number;
  readonly timeSpentSeconds: number;
  readonly goalMinutes: number;
  readonly goalReached: boolean;
}

export interface WeakArea {
  readonly topic: string;
  readonly subject: string;
  readonly accuracy: number;
  readonly questionsAttempted: number;
  readonly suggestedPracticeCount: number;
  readonly lastAttemptedAt: string;
}

export interface SubjectStat {
  readonly subject: string;
  readonly totalQuestions: number;
  readonly accuracy: number;
  readonly averageTimePerQuestion: number;
  readonly mastery: number;
}

// --- Navigation & UI Types ---

export interface NavItem {
  readonly label: string;
  readonly href: string;
  readonly icon: string;
  readonly badge: string | null;
  readonly isActive: boolean;
}

export interface BreadcrumbItem {
  readonly label: string;
  readonly href: string | null;
}

export interface TabItem {
  readonly id: string;
  readonly label: string;
  readonly count: number | null;
}

// --- Notification Types ---

export type NotificationType = "info" | "success" | "warning" | "error";

export interface Notification {
  readonly id: string;
  readonly type: NotificationType;
  readonly title: string;
  readonly message: string;
  readonly read: boolean;
  readonly createdAt: string;
  readonly actionUrl: string | null;
}

// --- Settings Types ---

export interface UserSettings {
  readonly theme: "dark" | "system";
  readonly fontSize: "small" | "medium" | "large";
  readonly explanationMode: ExplanationMode;
  readonly showTimer: boolean;
  readonly showProgress: boolean;
  readonly soundEnabled: boolean;
  readonly keyboardShortcuts: boolean;
  readonly dailyGoalMinutes: number;
  readonly emailNotifications: boolean;
}

// --- API integration compatibility types ---

export type Difficulty = "easy" | "medium" | "hard";

export interface TestMetadata {
  readonly totalQuestions: number;
  readonly difficultyBreakdown: Record<Difficulty, number>;
  readonly topics: ReadonlyArray<string>;
  readonly generatedNew: boolean;
}

export interface GeneratedTest {
  readonly id: string;
  readonly name: string;
  readonly questions: ReadonlyArray<Question>;
  readonly createdAt: string;
  readonly metadata: TestMetadata;
}

export interface TestGenerationConfig {
  readonly testName: string;
  readonly numberOfQuestions: number;
  readonly difficulty: Difficulty | "mixed";
  readonly questionTypes: ReadonlyArray<string>;
  readonly scrapedContent: string;
  readonly generateNew: boolean;
}

export interface ExplanationStep {
  readonly step: number;
  readonly title: string;
  readonly content: string;
}

export interface VoiceExplanation {
  readonly ssmlText: string;
  readonly plainText: string;
  readonly estimatedDurationSeconds: number;
}

export interface VideoScene {
  readonly order: number;
  readonly narration: string;
  readonly visualDescription: string;
  readonly durationSeconds: number;
  readonly keyPoints: ReadonlyArray<string>;
}

export interface VideoExplanation {
  readonly title: string;
  readonly scenes: ReadonlyArray<VideoScene>;
  readonly totalEstimatedDurationSeconds: number;
}

export interface StudyPhase {
  readonly week: number;
  readonly focus: string;
  readonly topics: ReadonlyArray<string>;
  readonly activities: ReadonlyArray<string>;
  readonly goals: ReadonlyArray<string>;
}

export interface StudyResource {
  readonly title: string;
  readonly type: "video" | "article" | "practice" | "textbook";
  readonly url?: string;
  readonly description: string;
}

export interface StudyPlan {
  readonly overview: string;
  readonly totalWeeks: number;
  readonly weeklyHours: number;
  readonly phases: ReadonlyArray<StudyPhase>;
  readonly resources: ReadonlyArray<StudyResource>;
}

export interface Source {
  readonly title: string;
  readonly url: string;
  readonly snippet: string;
}

export interface SearchOptions {
  readonly maxResults?: number;
  readonly focusArea?: string;
  readonly recencyFilter?: string;
}

export interface SearchResult {
  readonly content: string;
  readonly sources: ReadonlyArray<Source>;
  readonly relevanceScore: number;
}

export interface SearchRequest {
  readonly testName: string;
  readonly filters?: {
    readonly difficulty?: Difficulty;
    readonly questionCount?: number;
  };
}

export interface ExplainRequest {
  readonly question: Question;
  readonly userAnswer?: string;
  readonly mode: ExplanationMode;
}

export class FathomError extends Error {
  readonly statusCode: number;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.name = "FathomError";
    this.statusCode = statusCode;
  }
}

export class OpenAIError extends FathomError {
  constructor(message: string, statusCode = 500) {
    super(message, statusCode);
    this.name = "OpenAIError";
  }
}

export class PerplexityError extends FathomError {
  constructor(message: string, statusCode = 500) {
    super(message, statusCode);
    this.name = "PerplexityError";
  }
}
