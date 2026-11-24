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
├── domain/
│   └── <resource>.domain.ts
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

Dependency injection is manual and explicit. Concrete classes receive their
dependencies through constructors, and `src/bootstrap/dependencies.ts` is the
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

## Persistence and domain models

Prisma models describe database persistence. They are not application domain
models and must remain restricted to the database and repository boundary.

### Database naming convention

The Prisma schema separates application-facing names from physical PostgreSQL
names. Prisma models use `PascalCase`, and their fields use `camelCase`.
PostgreSQL tables use plural `snake_case`, columns use `snake_case`, and enum
types use singular `snake_case`. Enum values remain in `UPPER_SNAKE_CASE`.

Declare this mapping explicitly with `@@map` for models and enum types and
`@map` for multiword fields:

```prisma
model ActorCapability {
  actorId      String   @map("actor_id") @db.Uuid
  capabilityId String   @map("capability_id") @db.Uuid
  grantedAt    DateTime @default(now()) @map("granted_at")

  @@map("actor_capabilities")
}
```

Application code continues to use `actorCapability.capabilityId`, while SQL
and database tools expose `actor_capabilities.capability_id`. Apply this
convention to every new persistence model and migration.

The application defines its own analogous domains under `src/domain`:

```text
Prisma Actor model  -> persistence representation
Actor domain        -> application rules and behavior
ActorResponse       -> public HTTP representation
```

These representations may initially have similar properties, but they serve
different purposes and are allowed to evolve independently. Domain models must
not import Prisma types, the generated Prisma Client, Fastify types, or HTTP
response types.

Each domain owns its required properties, invariants, and construction rules
through a static `create` method:

```ts
const actor = Actor.create({
  active,
  capabilities,
  createdAt,
  id,
  name,
  type,
  updatedAt,
})
```

There is no separate `restore` method and no generic `AggregateRoot` base class.
The same `create` method constructs a valid domain from properties supplied by
an application use case or by a repository. Because it also reconstructs
persisted state, `create` must not automatically emit a creation event.

## Persistence-to-domain mapping

A repository is responsible for adapting Prisma records to the construction
contract defined by a domain:

```text
Prisma payload
  -> repository.toDomain
    -> related domains are created
      -> parent domain is created
        -> complete domain is returned
```

For example, an actor repository first creates its capability domains and then
creates the actor:

```ts
function toDomain(record: ActorRecord): Actor {
  const capabilities = record.capabilities.map(({ capability }) =>
    Capability.create({
      code: capability.code,
      id: capability.id,
      name: capability.name,
    }),
  )

  return Actor.create({
    active: record.active,
    capabilities,
    createdAt: record.createdAt,
    id: record.id,
    name: record.name,
    type: record.type,
    updatedAt: record.updatedAt,
  })
}
```

Keep `toDomain` private in the repository while it is used only there. Extract
it to a dedicated mapper only after concrete reuse appears.

The domain dictates what is required to construct a valid instance. The
repository must select and transform enough persistence data to satisfy that
contract. The domain must not adapt itself to an incomplete Prisma query.

## Complete domains and query projections

A repository method that promises a domain must always return a complete domain
according to that domain's property contract.

An actor with no capabilities is complete and uses an empty collection:

```ts
Actor.create({
  capabilities: [],
  // Other required properties.
})
```

Do not use `undefined` to mean that a relationship was not loaded. That creates
two ambiguous states: a known empty relationship and an unknown relationship.

Repositories return project-owned domains by default, including for aggregated
query resources such as `Scenario`. A repository must construct the domain
through its `create` method before returning it:

```text
Prisma records -> Scenario.create(...) -> Scenario
```

Do not introduce a read model or a `read-model` directory merely because an
endpoint is optimized for presentation. Read models are an architectural
exception and require an explicit decision before implementation.

Keep domain property contracts cohesive. Prefer one explicit properties type
owned by the domain over chains of near-identical interfaces using `extends`,
`Pick`, or `Omit`. Extract shared types only after concrete reuse demonstrates
that the additional abstraction improves the model.

Persistence join models do not automatically become domain objects. A join is
represented as its own domain concept only when the relationship carries domain
meaning, state, or behavior, such as grant origin, validity period, or status.

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
- is a concrete `<Resource>Controller` class;
- receives its service through constructor injection when a service exists;
- exposes bound handlers when they are passed directly to Fastify;
- returns a response type declared in `src/responses`;
- translates known application results into HTTP status codes and responses.

Do not create a controller interface unless multiple implementations establish
a concrete need for one.

## Services

A service represents application use cases and domain coordination. Create one
only when the resource has application or domain behavior.

A service:

- uses the `<resource>.service.ts` naming convention;
- is a concrete `<Resource>Service` class;
- receives repositories or other services through constructor injection;
- does not depend on Fastify request or reply objects;
- owns business rules, state transitions, and use-case coordination.

Do not create a service interface merely to mirror its class. Add an interface
only when multiple implementations establish a concrete need for one.

## Repositories

A repository encapsulates persistence behavior. Create one only when the
resource reads or writes persistent state.

A repository:

- uses the `<resource>.repository.ts` naming convention;
- exports a `<Resource>Repository` interface as the persistence contract;
- implements that contract in a `Prisma<Resource>Repository` class;
- receives the database client through constructor injection;
- exposes operations required by application use cases;
- converts persistence records into complete project-owned domains;
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
