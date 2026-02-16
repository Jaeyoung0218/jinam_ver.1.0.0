# Jinam

Jinam is a mobile-first web service for Taiwanese K-pop fans visiting Olympic Park in Seoul.

## Main UX Features

- Hero copy focused on first-time fan onboarding
- 3 quick feature icons (Today Concert / Locker / LINE chat)
- Concert list cards with D-Day, venue, start time, and quick CTA
- Card-level click interaction with poster tone visual differentiation
- Concert detail page with:
  - LINE open chat join button
  - Ticket booking link
  - Real-time state summary (goods + crowd)
  - Structured mini guide (entry / move / transport / notice)
- Real-time locker widget from `/api/lockers`
- Locker interpretation prompt: "Can I go now?"
- Partnership inquiry form via Formspree
  - success/failure feedback and retry flow

## Crawling Pipeline & Dashboard (New)

- Python crawler (`crawler/run_pipeline.py`)
  - Olympic Park source scraping with Playwright
  - WorldNol / YES24 ticket candidate mapping
  - OpenAI-based ZH-TW translation (`gpt-4o-mini`)
  - Supabase upsert for performances and ticket links
- Supabase schema: `supabase/schema.sql`
- Next.js APIs
  - `GET /api/performances`
  - `GET /api/performance/[id]`
  - `POST /api/jobs/archive` (archive finished+7days)
- i18n with `next-intl` (KO, ZH-TW)
  - localized pages: `/ko`, `/zh-TW`
  - admin review page: `/ko/admin`, `/zh-TW/admin`

## Project Structure

- `src/app/page.tsx`: Main page UI/UX
- `src/app/concerts/[id]/page.tsx`: Concert detail page
- `src/data/concerts.json`: Concert content and on-site metadata
- `src/types/concert.ts`: Shared concert type definitions

## Local Development

```bash
npm.cmd install
npm.cmd run dev
```

Open `http://localhost:3000`.

## Build Check

```bash
npm.cmd run build
npm.cmd run lint
```

## Deployment (Vercel)

1. Connect this GitHub repository to Vercel.
2. Keep framework preset as Next.js.
3. Deploy from `main` branch.
