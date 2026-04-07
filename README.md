<div align="center">

<br />

```
  ██████╗ ██╗████████╗██╗███╗   ██╗████████╗███████╗██╗     ██╗     ███████╗ ██████╗████████╗
 ██╔════╝ ██║╚══██╔══╝██║████╗  ██║╚══██╔══╝██╔════╝██║     ██║     ██╔════╝██╔════╝╚══██╔══╝
 ██║  ███╗██║   ██║   ██║██╔██╗ ██║   ██║   █████╗  ██║     ██║     █████╗  ██║        ██║   
 ██║   ██║██║   ██║   ██║██║╚██╗██║   ██║   ██╔══╝  ██║     ██║     ██╔══╝  ██║        ██║   
 ╚██████╔╝██║   ██║   ██║██║ ╚████║   ██║   ███████╗███████╗███████╗███████╗╚██████╗   ██║   
  ╚═════╝ ╚═╝   ╚═╝   ╚═╝╚═╝  ╚═══╝   ╚═╝   ╚══════╝╚══════╝╚══════╝╚══════╝ ╚═════╝   ╚═╝   
```

**AI-powered GitHub repository intelligence**

[![Work in Progress](https://img.shields.io/badge/status-work%20in%20progress-orange?style=flat-square)](https://github.com/IBs-DevStudio/gitintellect)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://typescriptlang.org)
[![License: MIT](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)

[Features](#features) · [Tech Stack](#tech-stack) · [Architecture](#architecture) · [Roadmap](#roadmap) · [Getting Started](#getting-started)

</div>

---

> **⚠️ Active Development** — Core RAG-based Q&A is live. Commit summaries, meeting↔diff linking, and feature finder are actively being built. Expect breaking changes.

---

## What is GitIntellect?

GitIntellect is an AI layer on top of your GitHub repositories. Link any repo and it becomes queryable — ask questions about the codebase, get commit summaries in plain English, find where a specific feature was added, or cross-reference a meeting transcript with what actually shipped.

No more `git log --oneline` archaeology. No more "what does this file do?" confusion.

---

## Features

| Feature | Status |
|---|---|
| Link any public GitHub repo | ✅ Live |
| Ask questions about the codebase (RAG + pgvector) | ✅ Live |
| Context-aware answers using Gemini embeddings | ✅ Live |
| Auto-summarise commits in plain English | 🔨 Building |
| Find where a feature was added (feature finder) | 🔨 Building |
| Meeting transcript ↔ code diff cross-reference | 🔨 Building |
| Change tracing across branches and PRs | 📋 Planned |

---

## Tech Stack

Built on the **T3 Stack** — the full-stack TypeScript foundation — extended with AI/ML infrastructure for embeddings and RAG.

<br />

<div align="center">

```
┌─────────────────────────────────────────────────────────────────────┐
│                          T3 STACK CORE                              │
├──────────────┬──────────────┬──────────────────┬────────────────────┤
│   Next.js 15 │  TypeScript  │      tRPC        │      Prisma        │
│   App Router │  end-to-end  │  type-safe APIs  │   ORM + raw SQL    │
├──────────────┴──────────────┴──────────────────┴────────────────────┤
│                         AI / ML LAYER                               │
├──────────────┬──────────────┬──────────────────┬────────────────────┤
│   Gemini API │   pgvector   │   OpenRouter     │   RAG Pipeline     │
│  embeddings  │  vector(768) │  free LLM calls  │  chunk → embed     │
│              │  similarity  │                  │  → retrieve → gen  │
├──────────────┴──────────────┴──────────────────┴────────────────────┤
│                       INFRASTRUCTURE                                │
├──────────────┬──────────────┬──────────────────────────────────────┤
│   Neon PG    │    Clerk     │          GitHub API                  │
│  serverless  │     auth     │     repo cloning + webhooks          │
└──────────────┴──────────────┴──────────────────────────────────────┘
```

</div>

<br />

### Why T3?

[T3 Stack](https://create.t3.gg) gives end-to-end type safety from the database to the UI. tRPC means zero API contract drift — the frontend calls backend procedures directly with full TypeScript inference. Prisma handles schema migrations; raw SQL extensions handle `vector(768)` types that Prisma's type system doesn't natively support.

```
Frontend (Next.js) → tRPC router → Prisma + pgvector → Neon PostgreSQL
                                ↓
                     Gemini embeddings API
                     OpenRouter (LLM calls)
```

---

## Architecture

### RAG Pipeline

```
GitHub Repo URL
      │
      ▼
 Clone + filter           ← strips non-code assets (images, lockfiles, etc.)
      │
      ▼
 Chunk code files         ← splits into overlapping ~512 token chunks
      │
      ▼
 Gemini embeddings        ← text-embedding-004 → vector(768)
      │
      ▼
 Store in pgvector        ← Neon PostgreSQL with pgvector extension
      │
      ▼
 Query time:
  user question → embed → cosine similarity search → top-k chunks
                                                           │
                                                           ▼
                                              OpenRouter LLM (free tier)
                                                           │
                                                           ▼
                                                  Grounded answer
```

### Key Engineering Decisions

**`vector(768)` via raw SQL** — Prisma's type system doesn't support pgvector natively. The solution: define the column via raw SQL in migrations, then use `prisma.$queryRaw` for all vector operations. This keeps Prisma's migration and query ergonomics while bypassing its type limitations.

**Branch fallback pattern** — when a repo has no `main` branch, GitIntellect falls back to `master`, then to the first available branch. Prevents silent failures on unconventionally branched repos.

**Post-load file filtering** — non-code files (`.png`, `.svg`, `package-lock.json`, `yarn.lock`, etc.) are filtered after cloning, not before. This avoids sparse-checkout complexity while keeping the embedding store clean.

**`??` for token passing** — OpenRouter auth tokens use nullish coalescing (`??`) not `||` to allow empty-string tokens to pass through correctly without being replaced by fallbacks.

---

## Getting Started

> Requires Node.js 18+, pnpm, and a Neon PostgreSQL database with pgvector enabled.

```bash
# Clone the repo
git clone https://github.com/IBs-DevStudio/gitintellect
cd gitintellect

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Fill in: DATABASE_URL, GEMINI_API_KEY, OPENROUTER_API_KEY, CLERK_*

# Run Prisma migrations (includes vector extension setup)
pnpm prisma migrate dev

# Start dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `GEMINI_API_KEY` | Google AI Studio API key (for embeddings) |
| `OPENROUTER_API_KEY` | OpenRouter key (free tier works) |
| `CLERK_SECRET_KEY` | Clerk backend secret |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk frontend key |

---

## Roadmap

### v0.1 — Core (current)
- [x] Repo ingestion pipeline
- [x] Gemini embeddings + pgvector storage
- [x] RAG-based Q&A via OpenRouter
- [x] Clerk auth + repo management UI

### v0.2 — Commit Intelligence 🔨
- [ ] Auto-summarise every commit on push (webhook-driven)
- [ ] Commit timeline view with plain-English descriptions
- [ ] Diff-aware summaries (what changed, not just what exists)

### v0.3 — Feature Finder 🔨
- [ ] "Find where dark mode was added" — pinpoints commit + file + line
- [ ] Natural language `git blame` interface
- [ ] Change tracing across branches and PRs

### v0.4 — Meeting Intelligence 📋
- [ ] Paste a meeting transcript → cross-reference with commits
- [ ] "What was discussed vs what actually shipped" report
- [ ] Action item extraction linked to code changes

---

## Project Structure

```
gitintellect/
├── src/
│   ├── app/                  # Next.js App Router pages
│   ├── server/
│   │   ├── api/routers/      # tRPC routers
│   │   └── db.ts             # Prisma client
│   ├── lib/
│   │   ├── embeddings.ts     # Gemini embedding pipeline
│   │   ├── ingest.ts         # Repo cloning + chunking
│   │   └── rag.ts            # Retrieval + generation
│   └── components/           # React components
├── prisma/
│   ├── schema.prisma
│   └── migrations/           # Includes raw SQL for vector(768)
└── .env.example
```

---

## Contributing

This project is under active development. Issues and PRs are welcome, but expect the architecture to shift as features are built out.

1. Fork the repo
2. Create a feature branch (`git checkout -b feat/your-feature`)
3. Commit your changes
4. Open a PR against `main`

---

<div align="center">

Built by [Ikram](https://github.com/IBs-DevStudio) · Part of [IBs-DevStudio](https://github.com/IBs-DevStudio)

</div>
