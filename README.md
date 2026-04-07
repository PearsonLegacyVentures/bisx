# BISX Pulse

BISX Pulse is a public, read-only market intelligence web app for the Bahamas International Securities Exchange. It surfaces the **latest available close** prices, issuer pages, news, filings, and index summaries with trust-first language and a clean mobile-friendly interface.

## Stack
- Next.js (App Router) + TypeScript
- Tailwind CSS
- Prisma ORM + SQLite
- Zod validation for imports
- TradingView Lightweight Charts for line charts

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
4. Seed fallback data:
   ```bash
   npm run db:seed
   ```
5. Run the app:
   ```bash
   npm run dev
   ```

## Prisma / SQLite notes
- `DATABASE_URL` defaults to `file:./dev.db`.
- Schema is in `prisma/schema.prisma`.
- This MVP is optimized for read-heavy public access and easy local setup.

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
- Works on any Next.js-compatible target (Vercel, self-hosted Node).
- Set `DATABASE_URL` to your deployed SQLite file path or migrate to managed DB.
- Run `prisma generate` and `prisma db push` in deployment pipeline.

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
