# Frontend conventions

- English is the official language for code, tests, logs, and documentation. User-facing copy is Brazilian Portuguese.
- Use React, strict TypeScript, Vite, Bootstrap 5, and Bootstrap Icons.
- Prefer standard Bootstrap components and utility classes before writing custom CSS.
- Do not introduce Tailwind, React Bootstrap, a global state library, or another component system without an explicit architectural decision.
- Use TanStack Query only for server state. Keep local presentation state inside the owning component.
- Keep HTTP access under `src/api`, shared visual components under `src/components`, and route-level screens under `src/pages`.
- Do not create generic `types` or `utils` directories. Keep contracts and helpers close to their actual responsibility.
- Every screen must handle loading, error, empty, and success states when applicable.
- Run lint, format check, typecheck, tests, and build before completing a change.
