# Architecture — Dehradun Travel Platform

## Overview

A full-stack monorepo for a Dehradun-based taxi, outstation travel, Uttarakhand tour, trekking, and safari booking platform. Every booking is a **request** until manually confirmed by an admin.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS |
| Backend | NestJS 10, TypeScript |
| Database | PostgreSQL 16 + Prisma ORM |
| Monorepo | pnpm workspaces |
| Testing | Jest (unit), Playwright (E2E) |
| CI/CD | GitHub Actions |
| Infra | Docker Compose (local) |

## Package Map

```
dehradun/
├── apps/web          — Next.js public website + admin CMS
├── apps/api          — NestJS REST API
├── packages/contracts — Shared Zod schemas, TypeScript types, enums
├── packages/prisma   — Prisma schema, client, migrations
├── tests/e2e         — Playwright end-to-end tests
├── infra/            — Docker Compose, deployment configs
└── docs/             — Architecture documentation
```

## Module Boundaries

| Package | Can Import | Cannot Import |
|---------|-----------|---------------|
| `@dehradun/contracts` | `zod` only | Any other workspace package |
| `@dehradun/prisma` | `@prisma/client` | `@dehradun/contracts` |
| `@dehradun/api` | `@dehradun/contracts`, `@dehradun/prisma` | `@dehradun/web` |
| `@dehradun/web` | `@dehradun/contracts` | `@dehradun/prisma`, `@dehradun/api` |
| `@dehradun/e2e` | `@playwright/test` | Any workspace package |

## Naming Conventions

| Item | Convention | Example |
|------|-----------|---------|
| Files | kebab-case | `health.controller.ts` |
| Classes | PascalCase | `HealthController` |
| Functions | camelCase | `isValidTransition()` |
| Enums | PascalCase values | `BookingStatus.PENDING_REVIEW` |
| DB columns | snake_case (via Prisma `@map`) | `customer_name` |
| API routes | kebab-case, prefixed `/api` | `GET /api/health` |
| Env vars | UPPER_SNAKE_CASE | `DATABASE_URL` |

## Environment Variables

| Variable | Server | Client | Description |
|----------|--------|--------|-------------|
| `DATABASE_URL` | ✅ | ❌ | PostgreSQL connection string |
| `API_PORT` | ✅ | ❌ | NestJS listen port |
| `JWT_SECRET` | ✅ | ❌ | Auth token signing key |
| `NEXT_PUBLIC_API_URL` | ✅ | ✅ | API base URL for fetch calls |

> **Rule:** Only `NEXT_PUBLIC_*` variables are safe for client bundles. Never expose DB credentials or secrets to the browser.

## Business Rules

1. **No auto-confirm:** Bookings start as `PENDING_REVIEW`. Only admins can transition to `CONFIRMED`.
2. **Status machine:** Valid transitions are enforced via `BOOKING_STATUS_TRANSITIONS` in `@dehradun/contracts`.
3. **Validation:** All inputs are validated with Zod schemas before reaching the database.

## Local Development

```bash
# 1. Clone & install
pnpm install

# 2. Start database
pnpm docker:up

# 3. Copy environment
cp .env.example .env

# 4. Generate Prisma client
pnpm db:generate

# 5. Run migrations
pnpm db:migrate:dev

# 6. Start both apps
pnpm dev:web   # http://localhost:3000
pnpm dev:api   # http://localhost:3001

# 7. Run tests
pnpm test         # unit tests
pnpm test:e2e     # Playwright
```

## CI Pipeline

```
push/PR → install → generate → lint → typecheck → test → build
```

All checks must pass before merge. The CI uses a PostgreSQL service container for integration tests.
