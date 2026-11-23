# Semantic Service Desk

Educational full-stack application for exploring robust, ontology-driven
agentic systems. A human describes a service desk problem, the application
extracts structured facts, ontology and policy rules determine eligibility,
and a human reviews the suggested resolver.

## Applications

| Application | Directory | Local URL |
| --- | --- | --- |
| Frontend | `frontend/` | `http://localhost:5173` |
| Backend API | `backend/` | `http://localhost:3000` |
| PostgreSQL | Docker Compose | `localhost:5432` |

The Vite development server proxies frontend requests from `/api/*` to the API
and removes the `/api` prefix. For example, `/api/scenario` reaches the backend
endpoint `/scenario`.

## First-time setup

Node.js `26.13.1`, npm, Docker, Docker Compose, and Make are required.

```bash
make setup
```

This installs both applications, starts PostgreSQL, generates Prisma Client,
applies migrations, and loads the educational seed.

## Development

Start PostgreSQL, the API, and the frontend together:

```bash
make dev
```

Individual processes are also available:

```bash
make database
make backend
make frontend
make seed
```

Stop `make dev` with `Ctrl+C`. PostgreSQL remains available until it is stopped
from `backend/` with `npm run db:down`.

## Project structure

```text
.
├── backend/   Fastify, Prisma, PostgreSQL, and domain models
├── frontend/  React, Vite, Bootstrap 5, and TanStack Query
└── Makefile   Local development orchestration
```

Read `backend/AGENTS.md` and `frontend/AGENTS.md` before modifying the
corresponding application.
