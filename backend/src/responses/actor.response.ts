import { type Static, Type } from '@sinclair/typebox'

const actorTypeSchema = Type.Union([
  Type.Literal('HUMAN'),
  Type.Literal('AI_AGENT'),
  Type.Literal('SERVICE'),
])

const resourceSchema = Type.Object(
  {
    code: Type.String(),
    description: Type.Union([Type.String(), Type.Null()]),
    id: Type.String({ format: 'uuid' }),
    name: Type.String(),
  },
  { additionalProperties: false },
)

const actorSummarySchema = Type.Object(
  {
    capabilitiesCount: Type.Integer({ minimum: 0 }),
    department: resourceSchema,
    email: Type.Union([Type.String({ format: 'email' }), Type.Null()]),
    id: Type.String({ format: 'uuid' }),
    name: Type.String(),
    teams: Type.Array(resourceSchema),
    type: actorTypeSchema,
  },
  { additionalProperties: false },
)

const datedRelationshipProperties = {
  createdAt: Type.String({ format: 'date-time' }),
  id: Type.String({ format: 'uuid' }),
}

const actorCapabilitySchema = Type.Object(
  {
    ...datedRelationshipProperties,
    capability: resourceSchema,
    grantedAt: Type.String({ format: 'date-time' }),
    revokedAt: Type.Union([Type.String({ format: 'date-time' }), Type.Null()]),
  },
  { additionalProperties: false },
)

const teamMembershipSchema = Type.Object(
  {
    ...datedRelationshipProperties,
    endedAt: Type.Union([Type.String({ format: 'date-time' }), Type.Null()]),
    startedAt: Type.String({ format: 'date-time' }),
    team: resourceSchema,
  },
  { additionalProperties: false },
)

const systemAuthorizationSchema = Type.Object(
  {
    ...datedRelationshipProperties,
    grantedAt: Type.String({ format: 'date-time' }),
    revokedAt: Type.Union([Type.String({ format: 'date-time' }), Type.Null()]),
    system: resourceSchema,
  },
  { additionalProperties: false },
)

export const actorsResponseSchema = Type.Object(
  { actors: Type.Array(actorSummarySchema) },
  { $id: 'ActorsResponse', additionalProperties: false },
)

export const actorResponseSchema = Type.Object(
  {
    active: Type.Boolean(),
    authorizations: Type.Array(systemAuthorizationSchema),
    capabilities: Type.Array(actorCapabilitySchema),
    createdAt: Type.String({ format: 'date-time' }),
    department: resourceSchema,
    email: Type.Union([Type.String({ format: 'email' }), Type.Null()]),
    id: Type.String({ format: 'uuid' }),
    memberships: Type.Array(teamMembershipSchema),
    name: Type.String(),
    type: actorTypeSchema,
    updatedAt: Type.String({ format: 'date-time' }),
  },
  { $id: 'ActorResponse', additionalProperties: false },
)

export const actorNotFoundResponseSchema = Type.Object(
  { message: Type.String() },
  { $id: 'ActorNotFoundResponse', additionalProperties: false },
)

export const actorIdParametersSchema = Type.Object(
  { id: Type.String({ format: 'uuid' }) },
  { additionalProperties: false },
)

export const actorsRouteSchema = {
  response: { 200: actorsResponseSchema },
} as const

export const actorRouteSchema = {
  params: actorIdParametersSchema,
  response: {
    200: actorResponseSchema,
    404: actorNotFoundResponseSchema,
  },
} as const

export type ActorIdParameters = Static<typeof actorIdParametersSchema>
export type ActorNotFoundResponse = Static<typeof actorNotFoundResponseSchema>
export type ActorResponse = Static<typeof actorResponseSchema>
export type ActorsResponse = Static<typeof actorsResponseSchema>
