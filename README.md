# Fathom

Fathom is a Firecrawl-inspired test-prep web app built in Next.js 16. It turns public exam signal into adaptive mock tests, then lets students circle questions and revisit them with AI explanations in text, voice, or video.

## Current scope

- Firecrawl-style landing page language:
  terminal hero, dense glass panels, scrolling exam marquee, ASCII motion, and compact metric cards.
- Interactive demo flow:
  enter an exam, hit the local `/api/mock-exam` route, generate a mock, select a question, and switch explanation modes.
- Product direction baked into the UI:
  support for scraped historical questions, synthetic new problems, and post-mock review loops.

## Run locally

```bash
npm run dev
```

Open `http://localhost:3000`.

## Collaboration note

If Claude continues from here, the main implementation lives in:

- `src/app/page.tsx`
- `src/app/layout.tsx`
- `src/app/globals.css`
- `src/app/api/mock-exam/route.ts`
- `src/components/landing/*`
- `src/lib/mock-exam.ts`

The current API route is a local mock generator so the product flow works without external keys. The intended next step is replacing the local generator with a Perplexity or scraping-backed research pipeline.
