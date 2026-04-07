# BISX Pulse

BISX Pulse is a public, read-only market intelligence web app for the Bahamas International Securities Exchange. It surfaces the **latest available close** prices, issuer pages, news, filings, and index summaries with trust-first language and a clean mobile-friendly interface.

## Stack
- Next.js (App Router) + TypeScript
- Tailwind CSS
- Prisma ORM + SQLite
- Zod validation for imports
- TradingView Lightweight Charts for line charts

## Data modes (important)
The app now supports two safe runtime modes:

1. **Database mode** (Prisma + SQLite)
   - Used when `DATABASE_URL` is present and Prisma can query successfully.
2. **Fallback mode** (local sample dataset)
   - Used automatically when `DATABASE_URL` is missing or Prisma is unavailable.
   - This keeps build-time prerendering safe on platforms like Cloudflare Pages.

You can always deploy without a live DB. In fallback mode, homepage, securities, security detail, news, and filings still render normally with sample BISX-aligned records.

## Local setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create local env:
   ```bash
   cp .env.example .env
   ```
3. Generate Prisma client and push schema:
   ```bash
   npm run db:generate
   npm run db:push
   ```
4. Seed database data (optional but recommended for DB mode):
   ```bash
   npm run db:seed
   ```
5. Run the app:
   ```bash
   npm run dev
   ```

## Prisma / SQLite notes
- `.env.example` includes:
  ```env
  DATABASE_URL="file:./dev.db"
  ```
- Schema is in `prisma/schema.prisma`.
- If `DATABASE_URL` is removed or invalid, the UI automatically falls back to local sample data.

## How to switch between fallback and DB mode
- **Use DB mode locally**:
  1. Set `DATABASE_URL` in `.env` (for example `file:./dev.db`).
  2. Run `npm run db:generate && npm run db:push`.
  3. (Optional) Run `npm run db:seed` or importer scripts.
- **Force fallback mode locally**:
  1. Remove/comment `DATABASE_URL` in `.env`.
  2. Restart `npm run dev`.

## Cloudflare Pages deployment behavior
- During Cloudflare build/prerender, if `DATABASE_URL` is not configured, pages render from fallback sample data instead of failing.
- If you later provide a working `DATABASE_URL`, the same pages will use Prisma-backed records.

## Running imports locally
- Full run:
  ```bash
  npm run import:all
  ```
- Individual jobs:
  - `npm run import:securities`
  - `npm run import:prices`
  - `npm run import:news`
  - `npm run import:filings`

Each importer logs status into the `ImportLog` table and stores source URL + import timestamp on records.

## Scheduled imports (GitHub Actions)
Workflow: `.github/workflows/import-data.yml`
- Supports `workflow_dispatch` for manual runs.
- Scheduled weekdays after close (`22:30 UTC`, Monday–Friday).
- Runs install, Prisma setup, and `import:all`.
- Uploads DB artifacts for diagnostics.

## Deployment
- Works on any Next.js-compatible target (Vercel, Cloudflare-compatible workflows, self-hosted Node).
- Set `DATABASE_URL` to your deployed SQLite file path (or managed DB URL) when you want DB mode.
- Keep `prisma generate` in your pipeline for DB-backed environments.

## Migration path to Postgres or Supabase later
1. Change datasource provider in `prisma/schema.prisma` from `sqlite` to `postgresql`.
2. Update `DATABASE_URL` to Postgres connection string.
3. Run `prisma migrate dev` or deploy migration flow.
4. Keep importer/UI code unchanged because persistence is abstracted through Prisma.

## Updating parser selectors when BISX markup changes
- Parsing helpers live under `src/server/parsers`.
- Keep selector logic isolated there.
- Update only parser selector mappings and leave importer persistence logic untouched.
- Re-run targeted import scripts to validate changes quickly.

## Product constraints
- Charts are line charts labeled **Closing Price History** unless true OHLC exists.
- No live-trading language and no brokerage framing.
- Informational use only; not investment advice.
