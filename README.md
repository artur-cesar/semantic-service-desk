# Agent Ontology API

Educational API for exploring ontology-driven agentic systems.

## Requirements

- Node.js `26.13.1`
- npm

## Run

```bash
nvm use
npm install
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
  "status": "ok"
}
```

## Checks

```bash
npm run lint
npm run format:check
npm run typecheck
npm test
npm run build
```

See [`docs/architecture.md`](docs/architecture.md) for project structure and
development conventions.
