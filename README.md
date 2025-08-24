# GitHub Portfolio Analyzer

A simple, resume-worthy web app that analyzes any GitHub username and visualizes:
- Top languages across public repositories
- Top repositories by stars
- Total stars and forks
- Profile quick stats (repos, followers, following)

Built with Next.js App Router, TypeScript, Tailwind CSS, and Chart.js.

## Quick start

1) Install and run locally

```
npm install
npm run dev
```

Open http://localhost:3000 and enter a GitHub username.

2) Optional: increase GitHub API rate limits

Create a `.env.local` file with a personal access token (no scopes needed) to bump from 60/hr to 5k/hr.

```
GITHUB_TOKEN=ghp_XXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

## Tech
- Next.js 15 (App Router) + TypeScript
- Tailwind CSS 4
- Chart.js via react-chartjs-2
- Edge-friendly API route with response caching

## Deploy
- One-click on Vercel (recommended). Add `GITHUB_TOKEN` as an Environment Variable if desired.

## Resume bullet ideas
- Built a full‑stack Next.js app that ingests GitHub REST data and renders interactive insights (Top Languages, Top Repos, Stars/Forks) with Chart.js.
- Implemented server-side caching and optional token auth to handle GitHub API rate limits; exposed a typed API route for reuse.
- Designed a responsive UI with Tailwind; shipped on Vercel with zero‑downtime previews.

## File structure
- `src/app/page.tsx` – UI and charts
- `src/app/api/github/route.ts` – API route calling GitHub
- `src/app/layout.tsx` – global layout and metadata
- `src/app/globals.css` – Tailwind setup
