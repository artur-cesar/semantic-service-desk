# Project conventions

Before adding or changing application features, read
[`docs/architecture.md`](docs/architecture.md).

## Project language

- English is the official language of the project.
- Write source code identifiers, comments, documentation, commit messages, logs, error messages, API contracts, and tests in English.
- User-provided domain terms may remain in their original language only when they are data being processed or when preserving the original wording is required.
- Prefer clear domain language over abbreviations and avoid mixing languages in identifiers or documentation.

## Dependency injection

- Use manual, explicit dependency injection through factory functions.
- Build the dependency graph in `src/bootstrap/dependencies.ts`.
- Do not introduce a dependency-injection container, decorators, reflection, providers, or service locators.
- Pass constructed controllers to Fastify route plugins through plugin options.
- Prefer the dependency direction `route -> controller -> service -> repository -> infrastructure` when those layers are actually needed.
- Do not create empty or speculative layers. Infrastructure routes such as health checks may use only a route and a controller.

## Fastify routes

- Keep route declarations concise: HTTP method, path, schema, and controller handler.
- Keep TypeBox schemas outside route declarations.
- Keep application and infrastructure behavior outside route files.

## Domain models

- Prisma models belong exclusively to the persistence layer. Do not use generated Prisma models as application domain models.
- Define project-owned domain models under `src/domain` for concepts that have domain meaning or behavior.
- A domain defines its own required properties, invariants, and construction rules through a static `create` method.
- Do not add a generic `AggregateRoot` base class or a separate `restore` construction path.
- Domain models must not import Prisma types, generated Prisma Client files, Fastify types, or HTTP response types.
- Repositories must convert persistence records into domains before returning them to services.
- Keep `toDomain` private inside the repository until concrete reuse justifies extracting a mapper.
- Build related domain objects before passing them to the parent domain's `create` method.
- A repository method that promises a domain must return a complete domain. Use empty collections for known empty relations; never use `undefined` to represent a relation that was not loaded.
- Use an explicit read model for partial or presentation-oriented queries instead of returning a partially loaded domain.
- A persistence join model becomes a domain concept only when the relationship has domain meaning, state, or behavior.

## Feature structure

- Organize application files by technical responsibility under `src/`.
- Follow these naming and location conventions when a resource needs the corresponding layer:
  - `src/routes/<resource>.routes.ts`
  - `src/controller/<resource>.controller.ts`
  - `src/domain/<resource>.domain.ts`
  - `src/responses/<resource>.response.ts`
  - `src/service/<resource>.service.ts`
  - `src/repository/<resource>.repository.ts`
- A response file must export its TypeBox response schemas and response types derived with `Static`.
- A controller must return a declared response type rather than an anonymous response shape.
- A route must import its schema from the resource response file and delegate handling to its controller.
- Register controllers and their dependencies in `src/bootstrap/dependencies.ts`.
- Register route plugins in `src/app.ts`.
- Never edit files under `src/generated/prisma`; regenerate them with `npm run db:generate`.
- Commit Prisma migrations, but do not commit the generated Prisma Client.
- Add only the files required by the resource. Do not create a service or repository for an endpoint that has no application or persistence behavior.

## Change checklist

When adding or changing an HTTP resource:

1. Add or update its TypeBox response schema and derived response type.
2. Add or update the controller and use the declared response type.
3. Add a service only when application or domain behavior exists.
4. Define or update project-owned domains when the resource has domain meaning or behavior.
5. Add a repository only when persistence behavior exists, and map persistence records to complete domains.
6. Wire dependencies explicitly in `src/bootstrap/dependencies.ts`.
7. Declare the route and register its plugin in `src/app.ts`.
8. Add or update automated tests.
9. Run `npm run lint`, `npm run format:check`, `npm run typecheck`, `npm test`, and `npm run build`.
