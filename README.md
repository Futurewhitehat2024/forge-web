# Forge — Creator OS

All-in-one creator operating system built with **Next.js 15**, **Clerk**, **Supabase**, **Tailwind CSS**, and **shadcn/ui**. Dark mode by default, Linear/Arc-inspired design.

**Live:** [forge-web-wellstech.vercel.app](https://forge-web-wellstech.vercel.app)

## Features

- **Dashboard** — Revenue KPIs, charts, weekly goals, activity feed
- **Content Hub** — Ideas, drafts, calendar, evergreen library
- **Video Studio** — Upload → auto-clip (20 clips) → edit → multi-platform publish
- **Asset Library** — Centralized media and brand files
- **Revenue & Payouts** — Platform connect, transactions, splits, contract generator
- **Financial Literacy** — Playbooks and calculators (tax, sponsorship, break-even, savings)
- **Content Advice** — Platform growth guides, Grok Strategy Lab, launch checklist
- **AI Coach** — Weekly game plan and Grok insights
- **Team & Collabs** — Roster, projects, invites, revenue splits
- **Settings** — Studio profile, sync, alerts, theme

## Local Development

### Prerequisites

- [Node.js 20+](https://nodejs.org/) (or bundled `.tools/node/`)
- [Clerk](https://clerk.com) application (free tier)
- [Supabase](https://supabase.com) project (free tier)

### Environment variables

```cmd
copy .env.example .env.local
```

Fill in `.env.local`:

| Variable | Where to get it |
|----------|-----------------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk Dashboard → API Keys |
| `CLERK_SECRET_KEY` | Clerk Dashboard → API Keys |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API (server only) |

### Database setup

Run `supabase/schema.sql` in the Supabase SQL Editor. This creates the `workspaces` table for per-user persistent state.

### Run locally

**Quick start (Windows):**

```cmd
cd C:\Users\orlan\forge-web
scripts\setup.cmd
scripts\dev.cmd
```

**Or manually:**

```powershell
cd C:\Users\orlan\forge-web
npm install
npm run dev
```

Node.js v22 is bundled in `.tools/node/` and added to your user PATH automatically.

Open [http://localhost:3000](http://localhost:3000). You'll be redirected to sign-in via Clerk.

### Build for production

```powershell
npm run build
npm start
```

## Deploy

### Vercel (recommended)

1. Push to GitHub (see below)
2. Import at [vercel.com](https://vercel.com) → **Add New Project**
3. Add all environment variables from `.env.example`
4. Deploy

Or CLI: `npx vercel --prod` (after `npx vercel login`)

**Required Vercel env vars:** All variables in `.env.example` (Clerk + Supabase keys).

### GitHub

```cmd
scripts\install-git.cmd
git remote add origin https://github.com/YOUR_USER/forge-web.git
git push -u origin main
```

### Netlify

1. Connect your GitHub repo at [netlify.com](https://netlify.com)
2. Build command: `npm run build`
3. Publish directory: `.next` (use Netlify's Next.js runtime plugin)

### Railway / Render

1. Connect repo, set start command: `npm start`
2. Build command: `npm run build`
3. Node version: 20+

## Tech Stack

- Next.js 15 (App Router)
- React 19
- Tailwind CSS 3
- shadcn/ui + Radix primitives
- Clerk (authentication)
- Supabase (PostgreSQL persistence)
- Zustand (client state + API sync)
- Recharts
- next-themes (dark/light/system)

## Project Structure

```
src/
├── app/              # Routes (dashboard, content, video, etc.)
├── components/
│   ├── ui/           # shadcn components
│   ├── layout/       # Sidebar, topbar
│   └── charts/       # Revenue charts
└── lib/
    ├── store.ts      # Zustand state
    ├── constants.ts  # Platforms, nav, tips
    └── contracts.ts  # Split contract generator
```

## Notes

- Platform OAuth and video processing are simulated in the UI for demo purposes
- Data persists per-user in Supabase via `/api/forge` (auto-save on changes)
- Clerk protects all app routes; sign-in/sign-up are public
- Original Streamlit version lives at `C:\Users\orlan\forge`
