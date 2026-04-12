// ---------------------------------------------------------------------------
// Fathom - Perplexity Sonar API client
// ---------------------------------------------------------------------------

import type { SearchOptions, SearchResult, Source } from '@/types'
import { PerplexityError } from '@/types'

// ---- Perplexity API types -------------------------------------------------

interface PerplexityMessage {
  readonly role: 'system' | 'user' | 'assistant'
  readonly content: string
}

interface PerplexityRequestBody {
  readonly model: string
  readonly messages: readonly PerplexityMessage[]
  readonly max_tokens?: number
  readonly temperature?: number
  readonly search_recency_filter?: string
}

interface PerplexityCitation {
  readonly url: string
  readonly title?: string
  readonly snippet?: string
}

interface PerplexityChoice {
  readonly message: {
    readonly role: string
    readonly content: string
  }
  readonly finish_reason: string
}

interface PerplexityResponse {
  readonly id: string
  readonly choices: readonly PerplexityChoice[]
  readonly citations?: readonly (string | PerplexityCitation)[]
}

interface PerplexityErrorResponse {
  readonly error?: {
    readonly message: string
    readonly type: string
    readonly code?: string
  }
}

// ---- Constants ------------------------------------------------------------

const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions'
const PERPLEXITY_MODEL = 'sonar'
const DEFAULT_MAX_TOKENS = 4096
const DEFAULT_TEMPERATURE = 0.2

// ---- API key validation ---------------------------------------------------

function getApiKey(): string {
  const key = process.env.PERPLEXITY_API_KEY
  if (!key) {
    throw new PerplexityError('PERPLEXITY_API_KEY environment variable is not configured', 500)
  }
  return key
}

// ---- Core fetch wrapper ---------------------------------------------------

async function callPerplexity(body: PerplexityRequestBody): Promise<PerplexityResponse> {
  const apiKey = getApiKey()

  const response = await fetch(PERPLEXITY_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const errorBody = await parseErrorResponse(response)
    const message = errorBody?.error?.message ?? `Perplexity API returned ${response.status}`

    if (response.status === 429) {
      throw new PerplexityError(
        'Rate limit exceeded. Please try again in a few moments.',
        429,
      )
    }

    throw new PerplexityError(message, response.status >= 500 ? 502 : response.status)
  }

  const data: unknown = await response.json()
  return validatePerplexityResponse(data)
}

async function parseErrorResponse(response: Response): Promise<PerplexityErrorResponse | null> {
  try {
    return (await response.json()) as PerplexityErrorResponse
  } catch {
    return null
  }
}

function validatePerplexityResponse(data: unknown): PerplexityResponse {
  if (
    typeof data !== 'object' ||
    data === null ||
    !('choices' in data) ||
    !Array.isArray((data as PerplexityResponse).choices)
  ) {
    throw new PerplexityError('Invalid response structure from Perplexity API', 502)
  }
  return data as PerplexityResponse
}

// ---- Source extraction ----------------------------------------------------

function extractSources(citations: readonly (string | PerplexityCitation)[] | undefined): readonly Source[] {
  if (!citations || citations.length === 0) {
    return []
  }

  return citations.map((citation): Source => {
    if (typeof citation === 'string') {
      return {
        title: extractDomainFromUrl(citation),
        url: citation,
        snippet: '',
      }
    }
    return {
      title: citation.title ?? extractDomainFromUrl(citation.url),
      url: citation.url,
      snippet: citation.snippet ?? '',
    }
  })
}

function extractDomainFromUrl(url: string): string {
  try {
    const parsed = new URL(url)
    return parsed.hostname.replace('www.', '')
  } catch {
    return url
  }
}

// ---- Public API -----------------------------------------------------------

/**
 * Searches the web for past tests, mock tests, and practice questions
 * related to a specific test name.
 */
export async function searchForTests(
  testName: string,
  options?: SearchOptions,
): Promise<SearchResult> {
  if (!testName.trim()) {
    throw new PerplexityError('Test name cannot be empty', 400)
  }

  const systemPrompt = [
    'You are an expert test preparation research assistant.',
    'Search for past exams, mock tests, practice questions, and study materials.',
    'Return comprehensive, well-structured content including:',
    '- Actual past test questions when available',
    '- Common question formats and patterns',
    '- Key topics and concepts tested',
    '- Difficulty distribution of questions',
    'Format the output as structured content that can be used to generate practice tests.',
    'Include question text, answer options (if multiple choice), and correct answers when available.',
    'Cite all sources.',
  ].join('\n')

  const focusSuffix = options?.focusArea ? ` focusing on ${options.focusArea}` : ''
  const userPrompt = [
    `Find past tests, mock exams, practice questions, and study materials for: "${testName}"${focusSuffix}.`,
    '',
    'Include:',
    '1. Real past exam questions with answers',
    '2. Common question types and formats',
    '3. Key topics and their frequency',
    '4. Difficulty levels of questions',
    `${options?.maxResults ? `Aim for at least ${options.maxResults} questions.` : 'Aim for at least 20 questions.'}`,
  ].join('\n')

  const body: PerplexityRequestBody = {
    model: PERPLEXITY_MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    max_tokens: DEFAULT_MAX_TOKENS,
    temperature: DEFAULT_TEMPERATURE,
    ...(options?.recencyFilter ? { search_recency_filter: options.recencyFilter } : {}),
  }

  const response = await callPerplexity(body)
  const content = response.choices[0]?.message?.content ?? ''
  const sources = extractSources(response.citations)

  return {
    content,
    sources,
    relevanceScore: sources.length > 0 ? Math.min(sources.length / 5, 1.0) : 0.5,
  }
}

/**
 * Searches for detailed explanations of a question within a subject area.
 */
export async function searchForExplanation(
  question: string,
  subject: string,
): Promise<SearchResult> {
  if (!question.trim()) {
    throw new PerplexityError('Question cannot be empty', 400)
  }
  if (!subject.trim()) {
    throw new PerplexityError('Subject cannot be empty', 400)
  }

  const systemPrompt = [
    'You are an expert tutor and educator.',
    'Provide thorough, clear explanations that help students deeply understand concepts.',
    'Structure explanations with:',
    '- A concise summary',
    '- Step-by-step reasoning',
    '- Real-world analogies when helpful',
    '- Common misconceptions to avoid',
    '- Related concepts for further study',
    'Cite authoritative educational sources.',
  ].join('\n')

  const userPrompt = [
    `Subject: ${subject}`,
    '',
    `Explain this question and its answer in detail: "${question}"`,
    '',
    'Provide:',
    '1. A clear, step-by-step explanation of how to solve/answer this',
    '2. The underlying concepts and principles',
    '3. Why wrong answers are wrong (if applicable)',
    '4. Tips for similar questions',
  ].join('\n')

  const body: PerplexityRequestBody = {
    model: PERPLEXITY_MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    max_tokens: DEFAULT_MAX_TOKENS,
    temperature: 0.3,
  }

  const response = await callPerplexity(body)
  const content = response.choices[0]?.message?.content ?? ''
  const sources = extractSources(response.citations)

  return {
    content,
    sources,
    relevanceScore: sources.length > 0 ? Math.min(sources.length / 3, 1.0) : 0.5,
  }
}
