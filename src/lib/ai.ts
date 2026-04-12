// ---------------------------------------------------------------------------
// Fathom - OpenAI generation client
// ---------------------------------------------------------------------------

import type {
  Question,
  TestGenerationConfig,
  GeneratedTest,
  TestMetadata,
  Explanation,
  VoiceExplanation,
  VideoExplanation,
  StudyPlan,
  Difficulty,
} from '@/types'
import { OpenAIError } from '@/types'

// ---- OpenAI API types -----------------------------------------------------

interface OpenAIMessage {
  readonly role: 'system' | 'user' | 'assistant'
  readonly content: string
}

interface OpenAIRequestBody {
  readonly model: string
  readonly messages: readonly OpenAIMessage[]
  readonly max_tokens?: number
  readonly temperature?: number
  readonly response_format?: { readonly type: 'json_object' }
  readonly stream?: boolean
}

interface OpenAIChoice {
  readonly message: {
    readonly role: string
    readonly content: string | null
  }
  readonly finish_reason: string
}

interface OpenAIResponse {
  readonly id: string
  readonly choices: readonly OpenAIChoice[]
  readonly usage?: {
    readonly prompt_tokens: number
    readonly completion_tokens: number
    readonly total_tokens: number
  }
}

interface OpenAIStreamChunk {
  readonly choices: readonly {
    readonly delta: {
      readonly content?: string
    }
    readonly finish_reason: string | null
  }[]
}

interface OpenAIErrorResponse {
  readonly error?: {
    readonly message: string
    readonly type: string
    readonly code?: string
  }
}

// ---- Constants ------------------------------------------------------------

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'
const OPENAI_MODEL = 'gpt-4o'
const DEFAULT_TEMPERATURE = 0.7

// ---- API key validation ---------------------------------------------------

function getApiKey(): string {
  const key = process.env.OPENAI_API_KEY
  if (!key) {
    throw new OpenAIError('OPENAI_API_KEY environment variable is not configured', 500)
  }
  return key
}

// ---- Core fetch wrappers --------------------------------------------------

async function callOpenAI(body: OpenAIRequestBody): Promise<OpenAIResponse> {
  const apiKey = getApiKey()

  const response = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const errorBody = await parseErrorResponse(response)
    const message = errorBody?.error?.message ?? `OpenAI API returned ${response.status}`

    if (response.status === 429) {
      throw new OpenAIError('Rate limit exceeded. Please try again in a few moments.', 429)
    }

    throw new OpenAIError(message, response.status >= 500 ? 502 : response.status)
  }

  const data: unknown = await response.json()
  return validateOpenAIResponse(data)
}

async function callOpenAIStream(body: OpenAIRequestBody): Promise<ReadableStream<Uint8Array>> {
  const apiKey = getApiKey()

  const response = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...body, stream: true }),
  })

  if (!response.ok) {
    const errorBody = await parseErrorResponse(response)
    const message = errorBody?.error?.message ?? `OpenAI API returned ${response.status}`

    if (response.status === 429) {
      throw new OpenAIError('Rate limit exceeded. Please try again in a few moments.', 429)
    }

    throw new OpenAIError(message, response.status >= 500 ? 502 : response.status)
  }

  if (!response.body) {
    throw new OpenAIError('No response body received from OpenAI streaming API', 502)
  }

  return transformSSEStream(response.body)
}

function transformSSEStream(source: ReadableStream<Uint8Array>): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder()
  const decoder = new TextDecoder()
  let buffer = ''

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = source.getReader()

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) {
            controller.close()
            break
          }

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() ?? ''

          for (const line of lines) {
            const trimmed = line.trim()
            if (!trimmed.startsWith('data: ')) continue
            const payload = trimmed.slice(6)
            if (payload === '[DONE]') {
              controller.close()
              return
            }

            try {
              const chunk = JSON.parse(payload) as OpenAIStreamChunk
              const content = chunk.choices[0]?.delta?.content
              if (content) {
                controller.enqueue(encoder.encode(content))
              }
            } catch {
              // Skip malformed chunks
            }
          }
        }
      } catch (error) {
        controller.error(error)
      } finally {
        reader.releaseLock()
      }
    },
  })
}

async function parseErrorResponse(response: Response): Promise<OpenAIErrorResponse | null> {
  try {
    return (await response.json()) as OpenAIErrorResponse
  } catch {
    return null
  }
}

function validateOpenAIResponse(data: unknown): OpenAIResponse {
  if (
    typeof data !== 'object' ||
    data === null ||
    !('choices' in data) ||
    !Array.isArray((data as OpenAIResponse).choices)
  ) {
    throw new OpenAIError('Invalid response structure from OpenAI API', 502)
  }
  return data as OpenAIResponse
}

// ---- JSON parsing helper --------------------------------------------------

function parseJSONContent<T>(content: string, label: string): T {
  // Strip markdown code fences if present
  const cleaned = content.replace(/^```(?:json)?\s*\n?/m, '').replace(/\n?```\s*$/m, '').trim()

  try {
    return JSON.parse(cleaned) as T
  } catch {
    throw new OpenAIError(`Failed to parse ${label} response as JSON`, 502)
  }
}

// ---- ID generation --------------------------------------------------------

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
}

// ---- Public API -----------------------------------------------------------

/**
 * Generates a full mock test from scraped content using OpenAI.
 */
export async function generateMockTest(config: TestGenerationConfig): Promise<GeneratedTest> {
  if (!config.testName.trim()) {
    throw new OpenAIError('Test name cannot be empty', 400)
  }
  if (config.numberOfQuestions < 1 || config.numberOfQuestions > 200) {
    throw new OpenAIError('Number of questions must be between 1 and 200', 400)
  }

  const systemPrompt = [
    'You are an expert test creator and educator.',
    'Generate high-quality test questions based on the provided content.',
    'Each question must be accurate, clear, and appropriately challenging.',
    '',
    'IMPORTANT: Respond with valid JSON only. No additional text.',
    '',
    'Response format:',
    '{',
    '  "questions": [',
    '    {',
    '      "type": "mcq" | "free-response" | "true-false",',
    '      "text": "question text",',
    '      "options": ["A", "B", "C", "D"],  // only for mcq',
    '      "correctAnswer": "the correct answer",',
    '      "explanation": "why this answer is correct",',
    '      "difficulty": "easy" | "medium" | "hard",',
    '      "topic": "topic name"',
    '    }',
    '  ]',
    '}',
  ].join('\n')

  const difficultyInstruction = config.difficulty === 'mixed'
    ? 'Use a mix of easy (20%), medium (50%), and hard (30%) questions.'
    : `All questions should be ${config.difficulty} difficulty.`

  const typeInstruction = config.questionTypes.length > 0
    ? `Question types to include: ${config.questionTypes.join(', ')}.`
    : 'Include a mix of multiple choice, true/false, and free-response questions.'

  const userPrompt = [
    `Create a mock test for: "${config.testName}"`,
    `Number of questions: ${config.numberOfQuestions}`,
    difficultyInstruction,
    typeInstruction,
    '',
    'Source content to base questions on:',
    '---',
    config.scrapedContent.slice(0, 12000),
    '---',
    '',
    'Generate questions that thoroughly test understanding of the material.',
    'Ensure variety in topics and question formats.',
    'Each question must have a clear, unambiguous correct answer and explanation.',
  ].join('\n')

  const response = await callOpenAI({
    model: OPENAI_MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    max_tokens: Math.min(config.numberOfQuestions * 300, 16000),
    temperature: DEFAULT_TEMPERATURE,
    response_format: { type: 'json_object' },
  })

  const content = response.choices[0]?.message?.content
  if (!content) {
    throw new OpenAIError('No content returned from OpenAI', 502)
  }

  const parsed = parseJSONContent<{ questions: RawQuestion[] }>(content, 'mock test')
  const questions = mapRawQuestions(parsed.questions, config.testName)
  const metadata = buildTestMetadata(questions, false)

  return {
    id: generateId(),
    name: config.testName,
    questions,
    createdAt: new Date().toISOString(),
    metadata,
  }
}

/**
 * Creates new, original problems based on patterns from existing questions.
 * Analyzes the style, difficulty, and topics of existing questions
 * then generates novel questions that follow similar patterns.
 */
export async function generateNewProblems(
  existingQuestions: readonly Question[],
  count: number,
): Promise<readonly Question[]> {
  if (existingQuestions.length === 0) {
    throw new OpenAIError('At least one existing question is required as a pattern', 400)
  }
  if (count < 1 || count > 100) {
    throw new OpenAIError('Count must be between 1 and 100', 400)
  }

  const systemPrompt = [
    'You are an expert test question creator.',
    'Analyze the provided questions for patterns in style, difficulty, topic coverage, and format.',
    'Then generate completely NEW, ORIGINAL questions that follow similar patterns.',
    'The new questions must NOT be copies or rephrases of the originals.',
    'They should test the same subject areas but with different scenarios and angles.',
    '',
    'IMPORTANT: Respond with valid JSON only. No additional text.',
    '',
    'Response format:',
    '{',
    '  "questions": [',
    '    {',
    '      "type": "mcq" | "free-response" | "true-false",',
    '      "text": "question text",',
    '      "options": ["A", "B", "C", "D"],',
    '      "correctAnswer": "the correct answer",',
    '      "explanation": "why this answer is correct",',
    '      "difficulty": "easy" | "medium" | "hard",',
    '      "topic": "topic name"',
    '    }',
    '  ]',
    '}',
  ].join('\n')

  const sampleQuestions = existingQuestions.slice(0, 20).map((q) => ({
    type: q.type,
    text: q.text,
    options: q.options,
    difficulty: q.difficulty,
    topic: q.topic,
  }))

  const userPrompt = [
    `Here are ${sampleQuestions.length} existing questions for pattern analysis:`,
    '',
    JSON.stringify(sampleQuestions, null, 2),
    '',
    `Generate ${count} completely NEW and ORIGINAL questions based on these patterns.`,
    'Maintain similar difficulty distribution and topic coverage.',
    'Ensure the new questions are distinct from the originals.',
  ].join('\n')

  const response = await callOpenAI({
    model: OPENAI_MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    max_tokens: Math.min(count * 300, 16000),
    temperature: 0.8,
    response_format: { type: 'json_object' },
  })

  const content = response.choices[0]?.message?.content
  if (!content) {
    throw new OpenAIError('No content returned from OpenAI', 502)
  }

  const parsed = parseJSONContent<{ questions: RawQuestion[] }>(content, 'new problems')
  return mapRawQuestions(parsed.questions, 'generated')
}

/**
 * Generates a detailed explanation for a question.
 * Returns a ReadableStream for text mode, or structured data for voice/video.
 */
export async function explainQuestion(
  question: Question,
  userAnswer?: string,
): Promise<ReadableStream<Uint8Array>> {
  const systemPrompt = [
    'You are an expert tutor providing clear, thorough explanations.',
    'Break down the problem step by step.',
    'If the student provided an answer, explain whether it is correct and why.',
    'Use clear language appropriate for a student preparing for an exam.',
    'Include:',
    '1. A brief overview of the concept',
    '2. Step-by-step solution/reasoning',
    '3. Why the correct answer is right',
    '4. Common mistakes to avoid',
    '5. Tips for similar questions',
  ].join('\n')

  const userPromptParts = [
    `Question: ${question.text}`,
    question.options ? `Options: ${question.options.join(', ')}` : '',
    `Correct Answer: ${question.correctAnswer}`,
    `Topic: ${question.topic}`,
    `Difficulty: ${question.difficulty}`,
    userAnswer ? `Student's Answer: ${userAnswer}` : '',
    userAnswer && userAnswer !== question.correctAnswer
      ? 'The student answered incorrectly. Explain what went wrong and guide them to the correct answer.'
      : '',
  ].filter(Boolean)

  return callOpenAIStream({
    model: OPENAI_MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPromptParts.join('\n') },
    ],
    max_tokens: 2048,
    temperature: 0.5,
  })
}

/**
 * Generates a structured text explanation (non-streaming) for voice/video modes.
 */
export async function explainQuestionStructured(
  question: Question,
  userAnswer?: string,
  mode: 'voice' | 'video' = 'voice',
): Promise<Explanation | VoiceExplanation | VideoExplanation> {
  if (mode === 'voice') {
    return generateVoiceExplanation(question, userAnswer)
  }
  return generateVideoExplanation(question, userAnswer)
}

async function generateVoiceExplanation(
  question: Question,
  userAnswer?: string,
): Promise<VoiceExplanation> {
  const systemPrompt = [
    'You are an expert tutor creating an explanation optimized for text-to-speech.',
    'Write in a natural, conversational tone that sounds good when read aloud.',
    'Avoid visual formatting like bullet points, tables, or special characters.',
    'Use clear transitions and pauses.',
    '',
    'IMPORTANT: Respond with valid JSON only.',
    '{',
    '  "ssmlText": "<speak>SSML-formatted explanation with <break time=\\"500ms\\"/> for pauses and <emphasis> for key terms</speak>",',
    '  "plainText": "Plain text version without SSML tags",',
    '  "estimatedDurationSeconds": 60',
    '}',
  ].join('\n')

  const userPrompt = buildExplanationPrompt(question, userAnswer)

  const response = await callOpenAI({
    model: OPENAI_MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    max_tokens: 2048,
    temperature: 0.5,
    response_format: { type: 'json_object' },
  })

  const content = response.choices[0]?.message?.content
  if (!content) {
    throw new OpenAIError('No content returned from OpenAI', 502)
  }

  return parseJSONContent<VoiceExplanation>(content, 'voice explanation')
}

async function generateVideoExplanation(
  question: Question,
  userAnswer?: string,
): Promise<VideoExplanation> {
  const systemPrompt = [
    'You are an expert tutor creating a structured explanation for a video lesson.',
    'Break the explanation into scenes, each with narration and visual descriptions.',
    'Visuals should describe what should appear on screen (diagrams, equations, animations).',
    '',
    'IMPORTANT: Respond with valid JSON only.',
    '{',
    '  "title": "Video title",',
    '  "scenes": [',
    '    {',
    '      "order": 1,',
    '      "narration": "What the narrator says",',
    '      "visualDescription": "What appears on screen",',
    '      "durationSeconds": 15,',
    '      "keyPoints": ["point 1", "point 2"]',
    '    }',
    '  ],',
    '  "totalEstimatedDurationSeconds": 120',
    '}',
  ].join('\n')

  const userPrompt = buildExplanationPrompt(question, userAnswer)

  const response = await callOpenAI({
    model: OPENAI_MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    max_tokens: 3000,
    temperature: 0.6,
    response_format: { type: 'json_object' },
  })

  const content = response.choices[0]?.message?.content
  if (!content) {
    throw new OpenAIError('No content returned from OpenAI', 502)
  }

  return parseJSONContent<VideoExplanation>(content, 'video explanation')
}

function buildExplanationPrompt(question: Question, userAnswer?: string): string {
  const parts = [
    `Question: ${question.text}`,
    question.options ? `Options: ${question.options.join(', ')}` : '',
    `Correct Answer: ${question.correctAnswer}`,
    `Topic: ${question.topic}`,
    `Difficulty: ${question.difficulty}`,
    userAnswer ? `Student's Answer: ${userAnswer}` : '',
    '',
    'Provide a thorough explanation covering:',
    '1. The core concept being tested',
    '2. Step-by-step reasoning to arrive at the answer',
    '3. Why incorrect options are wrong (if applicable)',
    '4. Key takeaways and tips',
  ]
  return parts.filter(Boolean).join('\n')
}

/**
 * Creates a personalized study plan based on weak areas and test type.
 */
export async function generateStudyPlan(
  weakAreas: readonly string[],
  testType: string,
): Promise<StudyPlan> {
  if (weakAreas.length === 0) {
    throw new OpenAIError('At least one weak area must be provided', 400)
  }
  if (!testType.trim()) {
    throw new OpenAIError('Test type cannot be empty', 400)
  }

  const systemPrompt = [
    'You are an expert academic advisor and study coach.',
    'Create personalized, actionable study plans.',
    'Plans should be realistic, progressive, and focused on the weakest areas first.',
    '',
    'IMPORTANT: Respond with valid JSON only.',
    '{',
    '  "overview": "Brief plan summary",',
    '  "totalWeeks": 4,',
    '  "weeklyHours": 10,',
    '  "phases": [',
    '    {',
    '      "week": 1,',
    '      "focus": "Main focus area",',
    '      "topics": ["topic1", "topic2"],',
    '      "activities": ["activity1", "activity2"],',
    '      "goals": ["goal1", "goal2"]',
    '    }',
    '  ],',
    '  "resources": [',
    '    {',
    '      "title": "Resource name",',
    '      "type": "video" | "article" | "practice" | "textbook",',
    '      "url": "optional url",',
    '      "description": "What this resource covers"',
    '    }',
    '  ]',
    '}',
  ].join('\n')

  const userPrompt = [
    `Create a study plan for the ${testType} exam.`,
    '',
    'Weak areas that need the most attention:',
    ...weakAreas.map((area, i) => `${i + 1}. ${area}`),
    '',
    'Requirements:',
    '- Prioritize the weakest areas in early weeks',
    '- Include specific practice activities for each area',
    '- Build progressively from fundamentals to advanced',
    '- Include review and practice test phases',
    '- Suggest specific resources (books, websites, videos)',
  ].join('\n')

  const response = await callOpenAI({
    model: OPENAI_MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    max_tokens: 4096,
    temperature: 0.6,
    response_format: { type: 'json_object' },
  })

  const content = response.choices[0]?.message?.content
  if (!content) {
    throw new OpenAIError('No content returned from OpenAI', 502)
  }

  return parseJSONContent<StudyPlan>(content, 'study plan')
}

// ---- Internal helpers -----------------------------------------------------

interface RawQuestion {
  readonly type?: string
  readonly text?: string
  readonly options?: string[]
  readonly correctAnswer?: string
  readonly correct_answer?: string
  readonly explanation?: string
  readonly difficulty?: string
  readonly topic?: string
}

function mapRawQuestions(
  raw: readonly RawQuestion[],
  sourceName: string,
): readonly Question[] {
  if (!Array.isArray(raw)) {
    throw new OpenAIError('Expected questions array in response', 502)
  }

  return raw.map((q): Question => ({
    id: generateId(),
    type: normalizeQuestionType(q.type),
    text: q.text ?? '',
    options: q.type === 'mcq' && Array.isArray(q.options) ? q.options : undefined,
    matchingPairs: null,
    correctAnswer: q.correctAnswer ?? q.correct_answer ?? '',
    explanation: q.explanation ?? undefined,
    difficulty: normalizeDifficulty(q.difficulty),
    topic: q.topic ?? 'General',
    subtopic: null,
    tags: [],
    timeEstimateSeconds: 90,
    points: 1,
    source: sourceName,
  }))
}

function normalizeQuestionType(type?: string): Question['type'] {
  const normalized = type?.toLowerCase().replace(/[\s_-]/g, '')
  switch (normalized) {
    case 'mcq':
    case 'multiplechoice':
    case 'multiple_choice':
      return 'mcq'
    case 'truefalse':
    case 'true_false':
    case 'tf':
      return 'true-false'
    case 'freeresponse':
    case 'free_response':
    case 'openended':
    case 'short_answer':
    case 'shortanswer':
      return 'free-response'
    default:
      return 'mcq'
  }
}

function normalizeDifficulty(difficulty?: string): Difficulty {
  const normalized = difficulty?.toLowerCase()
  switch (normalized) {
    case 'easy':
      return 'easy'
    case 'medium':
    case 'moderate':
      return 'medium'
    case 'hard':
    case 'difficult':
      return 'hard'
    default:
      return 'medium'
  }
}

function buildTestMetadata(
  questions: readonly Question[],
  generatedNew: boolean,
): TestMetadata {
  const difficultyBreakdown: Record<Difficulty, number> = {
    easy: 0,
    medium: 0,
    hard: 0,
  }

  const topicSet = new Set<string>()

  for (const q of questions) {
    const difficulty = q.difficulty === 'expert' ? 'hard' : q.difficulty
    difficultyBreakdown[difficulty] += 1
    topicSet.add(q.topic)
  }

  return {
    totalQuestions: questions.length,
    difficultyBreakdown,
    topics: Array.from(topicSet),
    generatedNew,
  }
}
