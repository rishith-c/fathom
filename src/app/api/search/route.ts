// ---------------------------------------------------------------------------
// POST /api/search - Search for test content via Perplexity Sonar
// ---------------------------------------------------------------------------

import { NextResponse } from 'next/server'
import { searchForTests } from '@/lib/perplexity'
import type { ApiResponse, SearchResult, SearchRequest } from '@/types'
import { FathomError } from '@/types'

// ---- Input validation -----------------------------------------------------

type ValidationResult = {
  readonly valid: true
  readonly data: SearchRequest
} | {
  readonly valid: false
  readonly error: string
}

function validateSearchRequest(body: unknown): ValidationResult {
  if (typeof body !== 'object' || body === null) {
    return { valid: false, error: 'Request body must be a JSON object' }
  }

  const record = body as Record<string, unknown>

  if (typeof record.testName !== 'string' || record.testName.trim().length === 0) {
    return { valid: false, error: 'testName is required and must be a non-empty string' }
  }

  if (record.testName.length > 500) {
    return { valid: false, error: 'testName must be 500 characters or fewer' }
  }

  if (record.filters !== undefined) {
    if (typeof record.filters !== 'object' || record.filters === null) {
      return { valid: false, error: 'filters must be an object' }
    }

    const filters = record.filters as Record<string, unknown>

    if (filters.difficulty !== undefined) {
      const validDifficulties = ['easy', 'medium', 'hard']
      if (!validDifficulties.includes(filters.difficulty as string)) {
        return { valid: false, error: 'filters.difficulty must be "easy", "medium", or "hard"' }
      }
    }

    if (filters.questionCount !== undefined) {
      if (typeof filters.questionCount !== 'number' || filters.questionCount < 1 || filters.questionCount > 200) {
        return { valid: false, error: 'filters.questionCount must be a number between 1 and 200' }
      }
    }
  }

  return {
    valid: true,
    data: {
      testName: record.testName as string,
      filters: record.filters as SearchRequest['filters'],
    },
  }
}

// ---- Route handler --------------------------------------------------------

export async function POST(request: Request): Promise<NextResponse<ApiResponse<SearchResult>>> {
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

  const validation = validateSearchRequest(body)
  if (!validation.valid) {
    return NextResponse.json(
      { success: false, error: validation.error },
      { status: 400 },
    )
  }

  const { testName, filters } = validation.data

  try {
    const result = await searchForTests(testName, {
      maxResults: filters?.questionCount,
      focusArea: filters?.difficulty ? `${filters.difficulty} difficulty questions` : undefined,
    })

    return NextResponse.json({
      success: true,
      data: result,
      meta: {
        requestId: crypto.randomUUID(),
        durationMs: Date.now() - startTime,
      },
    })
  } catch (error) {
    return buildErrorResponse(error, startTime)
  }
}

// ---- Error response builder -----------------------------------------------

function buildErrorResponse(
  error: unknown,
  startTime: number,
): NextResponse<ApiResponse<SearchResult>> {
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
