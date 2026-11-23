import { type Static, Type } from '@sinclair/typebox'

const capabilityActorResponseSchema = Type.Object(
  {
    actor: Type.Object(
      {
        active: Type.Boolean(),
        email: Type.Union([Type.String({ format: 'email' }), Type.Null()]),
        id: Type.String({ format: 'uuid' }),
        name: Type.String(),
        type: Type.Union([
          Type.Literal('HUMAN'),
          Type.Literal('AI_AGENT'),
          Type.Literal('SERVICE'),
        ]),
      },
      { additionalProperties: false },
    ),
    createdAt: Type.String({ format: 'date-time' }),
    grantedAt: Type.String({ format: 'date-time' }),
    id: Type.String({ format: 'uuid' }),
    isCurrent: Type.Boolean(),
    revokedAt: Type.Union([Type.String({ format: 'date-time' }), Type.Null()]),
  },
  { additionalProperties: false },
)

const capabilitySummaryResponseSchema = Type.Object(
  {
    actorsCount: Type.Integer({ minimum: 0 }),
    code: Type.String(),
    description: Type.Union([Type.String(), Type.Null()]),
    id: Type.String({ format: 'uuid' }),
    name: Type.String(),
  },
  { additionalProperties: false },
)

export const capabilitiesResponseSchema = Type.Object(
  { capabilities: Type.Array(capabilitySummaryResponseSchema) },
  { $id: 'CapabilitiesResponse', additionalProperties: false },
)

export const capabilityDetailsResponseSchema = Type.Object(
  {
    actors: Type.Array(capabilityActorResponseSchema),
    code: Type.String(),
    description: Type.Union([Type.String(), Type.Null()]),
    id: Type.String({ format: 'uuid' }),
    name: Type.String(),
  },
  { $id: 'CapabilityDetailsResponse', additionalProperties: false },
)

export const capabilityNotFoundResponseSchema = Type.Object(
  { message: Type.String() },
  { $id: 'CapabilityNotFoundResponse', additionalProperties: false },
)

export const capabilityIdParametersSchema = Type.Object(
  { id: Type.String({ format: 'uuid' }) },
  { additionalProperties: false },
)

export const capabilitiesRouteSchema = {
  response: { 200: capabilitiesResponseSchema },
} as const

export const capabilityDetailsRouteSchema = {
  params: capabilityIdParametersSchema,
  response: {
    200: capabilityDetailsResponseSchema,
    404: capabilityNotFoundResponseSchema,
  },
} as const

export type CapabilitiesResponse = Static<typeof capabilitiesResponseSchema>
export type CapabilityDetailsResponse = Static<
  typeof capabilityDetailsResponseSchema
>
export type CapabilityIdParameters = Static<typeof capabilityIdParametersSchema>
export type CapabilityNotFoundResponse = Static<
  typeof capabilityNotFoundResponseSchema
>
