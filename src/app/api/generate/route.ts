// ---------------------------------------------------------------------------
// POST /api/generate - Generate mock tests via OpenAI
// ---------------------------------------------------------------------------

import { NextResponse } from 'next/server'
import { generateMockTest, generateNewProblems } from '@/lib/ai'
import type { ApiResponse, GeneratedTest, TestGenerationConfig, Question } from '@/types'
import { FathomError } from '@/types'

// ---- Input validation -----------------------------------------------------

interface ValidConfig {
  readonly valid: true
  readonly data: TestGenerationConfig
}

interface InvalidConfig {
  readonly valid: false
  readonly error: string
}

type ConfigValidation = ValidConfig | InvalidConfig

const VALID_DIFFICULTIES = ['easy', 'medium', 'hard', 'mixed'] as const
const VALID_QUESTION_TYPES = ['mcq', 'free-response', 'true-false'] as const

function validateGenerateRequest(body: unknown): ConfigValidation {
  if (typeof body !== 'object' || body === null) {
    return { valid: false, error: 'Request body must be a JSON object' }
  }

  const record = body as Record<string, unknown>

  // testName
  if (typeof record.testName !== 'string' || record.testName.trim().length === 0) {
    return { valid: false, error: 'testName is required and must be a non-empty string' }
  }
  if (record.testName.length > 500) {
    return { valid: false, error: 'testName must be 500 characters or fewer' }
  }

  // numberOfQuestions
  if (typeof record.numberOfQuestions !== 'number') {
    return { valid: false, error: 'numberOfQuestions is required and must be a number' }
  }
  if (record.numberOfQuestions < 1 || record.numberOfQuestions > 200 || !Number.isInteger(record.numberOfQuestions)) {
    return { valid: false, error: 'numberOfQuestions must be an integer between 1 and 200' }
  }

  // difficulty
  if (!VALID_DIFFICULTIES.includes(record.difficulty as typeof VALID_DIFFICULTIES[number])) {
    return { valid: false, error: `difficulty must be one of: ${VALID_DIFFICULTIES.join(', ')}` }
  }

  // questionTypes
  if (!Array.isArray(record.questionTypes)) {
    return { valid: false, error: 'questionTypes must be an array of strings' }
  }
  for (const qt of record.questionTypes) {
    if (!VALID_QUESTION_TYPES.includes(qt as typeof VALID_QUESTION_TYPES[number])) {
      return { valid: false, error: `Invalid question type "${qt}". Must be one of: ${VALID_QUESTION_TYPES.join(', ')}` }
    }
  }

  // scrapedContent
  if (typeof record.scrapedContent !== 'string') {
    return { valid: false, error: 'scrapedContent is required and must be a string' }
  }

  // generateNew
  if (typeof record.generateNew !== 'boolean') {
    return { valid: false, error: 'generateNew is required and must be a boolean' }
  }

  // For generateNew mode, scrapedContent should parse as existing questions
  if (record.generateNew && record.scrapedContent.trim().length === 0) {
    return { valid: false, error: 'scrapedContent must contain question data when generateNew is true' }
  }

  if (!record.generateNew && record.scrapedContent.trim().length === 0) {
    return { valid: false, error: 'scrapedContent cannot be empty for test generation' }
  }

  return {
    valid: true,
    data: {
      testName: record.testName as string,
      numberOfQuestions: record.numberOfQuestions as number,
      difficulty: record.difficulty as TestGenerationConfig['difficulty'],
      questionTypes: record.questionTypes as string[],
      scrapedContent: record.scrapedContent as string,
      generateNew: record.generateNew as boolean,
    },
  }
}

function parseExistingQuestions(content: string): readonly Question[] | null {
  try {
    const parsed = JSON.parse(content) as unknown
    if (Array.isArray(parsed)) {
      return parsed as Question[]
    }
    if (typeof parsed === 'object' && parsed !== null && 'questions' in parsed) {
      return (parsed as { questions: Question[] }).questions
    }
    return null
  } catch {
    return null
  }
}

// ---- Route handler --------------------------------------------------------

export async function POST(request: Request): Promise<NextResponse<ApiResponse<GeneratedTest>>> {
  const startTime = Date.now()

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid JSON in request body' },
      { status: 400 },
    )
  }

  const validation = validateGenerateRequest(body)
  if (!validation.valid) {
    return NextResponse.json(
      { success: false, error: validation.error },
      { status: 400 },
    )
  }

  const config = validation.data

  try {
    if (config.generateNew) {
      // "Generate New" mode: parse existing questions from scrapedContent
      // and create novel questions based on the patterns
      const existingQuestions = parseExistingQuestions(config.scrapedContent)
      if (!existingQuestions || existingQuestions.length === 0) {
        return NextResponse.json(
          { success: false, error: 'Could not parse existing questions from scrapedContent for new problem generation' },
          { status: 400 },
        )
      }

      const newQuestions = await generateNewProblems(existingQuestions, config.numberOfQuestions)

      const test: GeneratedTest = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
        name: config.testName,
        questions: newQuestions,
        createdAt: new Date().toISOString(),
        metadata: {
          totalQuestions: newQuestions.length,
          difficultyBreakdown: countDifficulties(newQuestions),
          topics: extractTopics(newQuestions),
          generatedNew: true,
        },
      }

      return NextResponse.json({
        success: true,
        data: test,
        meta: {
          requestId: crypto.randomUUID(),
          durationMs: Date.now() - startTime,
        },
      })
    }

    // "Cycle Old" mode: generate a mock test from scraped content
    const test = await generateMockTest(config)

    return NextResponse.json({
      success: true,
      data: test,
      meta: {
        requestId: crypto.randomUUID(),
        durationMs: Date.now() - startTime,
      },
    })
  } catch (error) {
    return buildErrorResponse(error, startTime)
  }
}

// ---- Helpers --------------------------------------------------------------

function countDifficulties(
  questions: readonly Question[],
): Record<'easy' | 'medium' | 'hard', number> {
  const counts = { easy: 0, medium: 0, hard: 0 }
  for (const q of questions) {
    const difficulty = q.difficulty === 'expert' ? 'hard' : q.difficulty
    counts[difficulty] += 1
  }
  return counts
}

function extractTopics(questions: readonly Question[]): readonly string[] {
  const topics = new Set<string>()
  for (const q of questions) {
    topics.add(q.topic)
  }
  return Array.from(topics)
}

function buildErrorResponse(
  error: unknown,
  startTime: number,
): NextResponse<ApiResponse<GeneratedTest>> {
  if (error instanceof FathomError) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        meta: {
          requestId: crypto.randomUUID(),
          durationMs: Date.now() - startTime,
        },
      },
      { status: error.statusCode },
    )
  }

  const message = error instanceof Error ? error.message : 'An unexpected error occurred'
  return NextResponse.json(
    {
      success: false,
      error: message,
      meta: {
        requestId: crypto.randomUUID(),
        durationMs: Date.now() - startTime,
      },
    },
    { status: 500 },
  )
}
