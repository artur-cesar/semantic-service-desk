# Agent Ontology API

Educational API for exploring ontology-driven agentic systems.

## Requirements

- Node.js `26.13.1`
- npm

## Run

```bash
nvm use
npm install
npm run db:up
npm run db:generate
npm run dev
```

The API is available at `http://localhost:3000`.

## Health check

```bash
curl http://localhost:3000/health
```

Response:

```json
{
  "database": "reachable",
  "status": "ok"
}
```

## Database

PostgreSQL runs in Docker while the API runs locally:

```bash
npm run db:up
npm run db:logs
npm run db:down
```

Copy `.env.example` to `.env` before running the application in a fresh clone.

Prisma commands:

```bash
npm run db:generate
npm run db:migrate
npm run db:studio
```

## Checks

```bash
npm run lint
npm run format:check
npm run typecheck
npm test
npm run build
```

The pre-push Git hook runs lint and tests. GitHub Actions also checks formatting,
types, tests, and the production build on every push and pull request.

See [`docs/architecture.md`](docs/architecture.md) for project structure and
development conventions.
