# Architecture

## Purpose

This project is an educational API for demonstrating robust, ontology-driven
agentic systems. The application should remain explicit and easy to inspect.
Framework conventions must not hide dependency construction or domain behavior.

## Application structure

```text
src/
├── app.ts
├── server.ts
├── bootstrap/
│   └── dependencies.ts
├── controller/
│   └── <resource>.controller.ts
├── repository/
│   └── <resource>.repository.ts
├── responses/
│   └── <resource>.response.ts
├── routes/
│   └── <resource>.routes.ts
└── service/
    └── <resource>.service.ts
```

Files are grouped by technical responsibility. A resource uses only the layers
it actually needs.

## Dependency flow

The allowed dependency direction is:

```text
route -> controller -> service -> repository -> infrastructure
```

Dependencies must not point in the opposite direction. In particular:

- repositories must not import services or controllers;
- services must not import routes, controllers, or Fastify request objects;
- controllers must not execute persistence queries directly;
- routes must not contain application or domain behavior.

## Manual dependency injection

Dependency injection is manual and explicit. Factory functions receive their
dependencies as arguments, and `src/bootstrap/dependencies.ts` is the
composition root.

The expected construction order is:

```text
infrastructure
  -> repository
    -> service
      -> controller
```

The resulting controller is passed to its Fastify route plugin through plugin
options. Do not use a dependency-injection container, decorators, reflection,
providers, or Fastify decorators as a service locator.

## Routes

A route file declares only the HTTP boundary:

```text
HTTP method + path + schema + controller handler
```

Route files:

- use the `<resource>.routes.ts` naming convention;
- receive an already constructed controller through plugin options;
- import response schemas instead of defining them inline;
- delegate behavior to the controller;
- are registered in `src/app.ts`.

## Responses

A response file is the public output contract for a resource. It uses the
`<resource>.response.ts` naming convention and exports:

- TypeBox schemas used by Fastify route declarations;
- TypeScript response types derived from those schemas with `Static`;
- the route response map when it is shared by the resource route.

The TypeBox schema is the source of truth. Do not manually duplicate a schema
as a separate TypeScript interface.

Example export names for a `ticket` resource:

```text
ticketResponseSchema
createTicketResponseSchema
ticketRouteSchema
TicketResponse
CreateTicketResponse
```

Use names that describe the endpoint when one resource has multiple response
shapes.

## Controllers

A controller adapts HTTP to the application. It may know about Fastify request
and reply objects, but it must not contain persistence queries or substantial
domain behavior.

A controller:

- uses the `<resource>.controller.ts` naming convention;
- is created by a `create<Resource>Controller` factory;
- receives its service through the factory when a service exists;
- returns a response type declared in `src/responses`;
- translates known application results into HTTP status codes and responses.

Infrastructure endpoints may use a controller without a service when no
application behavior exists. The health check is the current example.

## Services

A service represents application use cases and domain coordination. Create one
only when the resource has application or domain behavior.

A service:

- uses the `<resource>.service.ts` naming convention;
- is created by a `create<Resource>Service` factory;
- receives repositories or other services explicitly;
- does not depend on Fastify request or reply objects;
- owns business rules, state transitions, and use-case coordination.

## Repositories

A repository encapsulates persistence behavior. Create one only when the
resource reads or writes persistent state.

A repository:

- uses the `<resource>.repository.ts` naming convention;
- is created by a `create<Resource>Repository` factory;
- receives the database client explicitly;
- exposes operations required by application use cases;
- does not decide HTTP status codes or business workflows.

Do not introduce a generic base repository. Repository contracts should reflect
the needs of their resource and use cases.

## Application construction

`src/app.ts` builds the Fastify application and registers route plugins. It must
not start the HTTP listener.

`src/server.ts` is the process entry point. It builds the application, starts
the listener, and coordinates graceful shutdown.

This separation allows tests to exercise the API with Fastify `inject` without
opening a network port.

## Testing and validation

Every HTTP resource must have automated coverage for its public behavior.
Before considering a change complete, run:

```bash
npm run lint
npm run format:check
npm run typecheck
npm test
npm run build
```

Use `npm run lint:fix` and `npm run format` to apply safe mechanical fixes.
