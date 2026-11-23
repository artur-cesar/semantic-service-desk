# Semantic Service Desk frontend

React interface for exploring the ontology-driven service desk scenario.

## Stack

- React with strict TypeScript
- Vite
- Bootstrap 5 and Bootstrap Icons
- React Router
- TanStack Query
- Vitest and Testing Library

## Run

```bash
nvm use
npm install
npm run dev
```

The frontend runs at `http://localhost:5173`. During local development, Vite
proxies `/api/*` to the backend at `http://localhost:3000`.

The initial screen is available at `http://localhost:5173/scenario`.

## Checks

```bash
npm run lint
npm run format:check
npm run typecheck
npm test
npm run build
```
