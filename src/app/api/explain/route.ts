// ---------------------------------------------------------------------------
// POST /api/explain - Generate question explanations via OpenAI
// ---------------------------------------------------------------------------

import { NextResponse } from 'next/server'
import { explainQuestion, explainQuestionStructured } from '@/lib/ai'
import type {
  ApiResponse,
  Explanation,
  VoiceExplanation,
  VideoExplanation,
  ExplainRequest,
  Question,
} from '@/types'
import { FathomError } from '@/types'

// ---- Input validation -----------------------------------------------------

type ExplainMode = 'text' | 'voice' | 'video'

const VALID_MODES: readonly ExplainMode[] = ['text', 'voice', 'video']
const VALID_QUESTION_TYPES: readonly string[] = ['mcq', 'free-response', 'true-false']
const VALID_DIFFICULTIES: readonly string[] = ['easy', 'medium', 'hard']

interface ValidRequest {
  readonly valid: true
  readonly data: ExplainRequest
}

interface InvalidRequest {
  readonly valid: false
  readonly error: string
}

type RequestValidation = ValidRequest | InvalidRequest

function validateExplainRequest(body: unknown): RequestValidation {
  if (typeof body !== 'object' || body === null) {
    return { valid: false, error: 'Request body must be a JSON object' }
  }

  const record = body as Record<string, unknown>

  // mode
  if (!VALID_MODES.includes(record.mode as ExplainMode)) {
    return { valid: false, error: `mode must be one of: ${VALID_MODES.join(', ')}` }
  }

  // question
  const questionValidation = validateQuestion(record.question)
  if (!questionValidation.valid) {
    return { valid: false, error: questionValidation.error }
  }

  // userAnswer (optional)
  if (record.userAnswer !== undefined && typeof record.userAnswer !== 'string') {
    return { valid: false, error: 'userAnswer must be a string when provided' }
  }

  return {
    valid: true,
    data: {
      question: record.question as Question,
      userAnswer: record.userAnswer as string | undefined,
      mode: record.mode as ExplainMode,
    },
  }
}

function validateQuestion(
  question: unknown,
): { readonly valid: true } | { readonly valid: false; readonly error: string } {
  if (typeof question !== 'object' || question === null) {
    return { valid: false, error: 'question is required and must be an object' }
  }

  const q = question as Record<string, unknown>

  if (typeof q.id !== 'string' || q.id.trim().length === 0) {
    return { valid: false, error: 'question.id is required' }
  }

  if (!VALID_QUESTION_TYPES.includes(q.type as string)) {
    return { valid: false, error: `question.type must be one of: ${VALID_QUESTION_TYPES.join(', ')}` }
  }

  if (typeof q.text !== 'string' || q.text.trim().length === 0) {
    return { valid: false, error: 'question.text is required and must be non-empty' }
  }

  if (typeof q.correctAnswer !== 'string') {
    return { valid: false, error: 'question.correctAnswer is required' }
  }

  if (!VALID_DIFFICULTIES.includes(q.difficulty as string)) {
    return { valid: false, error: `question.difficulty must be one of: ${VALID_DIFFICULTIES.join(', ')}` }
  }

  if (typeof q.topic !== 'string' || q.topic.trim().length === 0) {
    return { valid: false, error: 'question.topic is required and must be non-empty' }
  }

  if (q.options !== undefined && !Array.isArray(q.options)) {
    return { valid: false, error: 'question.options must be an array when provided' }
  }

  return { valid: true }
}

// ---- Route handler --------------------------------------------------------

export async function POST(
  request: Request,
): Promise<NextResponse<ApiResponse<Explanation | VoiceExplanation | VideoExplanation>> | Response> {
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

  const validation = validateExplainRequest(body)
  if (!validation.valid) {
    return NextResponse.json(
      { success: false, error: validation.error },
      { status: 400 },
    )
  }

  const { question, userAnswer, mode } = validation.data

  try {
    // Text mode: stream the explanation
    if (mode === 'text') {
      return buildStreamingResponse(question, userAnswer)
    }

    // Voice and video modes: return structured JSON
    const explanation = await explainQuestionStructured(question, userAnswer, mode)

    return NextResponse.json({
      success: true,
      data: explanation,
      meta: {
        requestId: crypto.randomUUID(),
        durationMs: Date.now() - startTime,
      },
    })
  } catch (error) {
    return buildErrorResponse(error, startTime)
  }
}

// ---- Streaming response ---------------------------------------------------

async function buildStreamingResponse(
  question: Question,
  userAnswer?: string,
): Promise<Response> {
  try {
    const stream = await explainQuestion(question, userAnswer)

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch (error) {
    if (error instanceof FathomError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.statusCode },
      )
    }

    const message = error instanceof Error ? error.message : 'Failed to stream explanation'
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    )
  }
}

// ---- Error response builder -----------------------------------------------

function buildErrorResponse(
  error: unknown,
  startTime: number,
): NextResponse<ApiResponse<Explanation | VoiceExplanation | VideoExplanation>> {
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
