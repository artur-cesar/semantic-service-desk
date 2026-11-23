import { type Static, Type } from '@sinclair/typebox'

const actionResponseSchema = Type.Object(
  {
    code: Type.String(),
    description: Type.Union([Type.String(), Type.Null()]),
    id: Type.String({ format: 'uuid' }),
    name: Type.String(),
  },
  { additionalProperties: false },
)

const authorizedActorResponseSchema = Type.Object(
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

const systemSummaryResponseSchema = Type.Object(
  {
    actionsCount: Type.Integer({ minimum: 0 }),
    authorizedActorsCount: Type.Integer({ minimum: 0 }),
    code: Type.String(),
    description: Type.Union([Type.String(), Type.Null()]),
    id: Type.String({ format: 'uuid' }),
    name: Type.String(),
  },
  { additionalProperties: false },
)

export const systemsResponseSchema = Type.Object(
  { systems: Type.Array(systemSummaryResponseSchema) },
  { $id: 'SystemsResponse', additionalProperties: false },
)

export const systemDetailsResponseSchema = Type.Object(
  {
    actions: Type.Array(actionResponseSchema),
    authorizedActors: Type.Array(authorizedActorResponseSchema),
    code: Type.String(),
    description: Type.Union([Type.String(), Type.Null()]),
    id: Type.String({ format: 'uuid' }),
    name: Type.String(),
  },
  { $id: 'SystemDetailsResponse', additionalProperties: false },
)

export const systemNotFoundResponseSchema = Type.Object(
  { message: Type.String() },
  { $id: 'SystemNotFoundResponse', additionalProperties: false },
)

export const systemIdParametersSchema = Type.Object(
  { id: Type.String({ format: 'uuid' }) },
  { additionalProperties: false },
)

export const systemsRouteSchema = {
  response: { 200: systemsResponseSchema },
} as const

export const systemDetailsRouteSchema = {
  params: systemIdParametersSchema,
  response: {
    200: systemDetailsResponseSchema,
    404: systemNotFoundResponseSchema,
  },
} as const

export type SystemDetailsResponse = Static<typeof systemDetailsResponseSchema>
export type SystemIdParameters = Static<typeof systemIdParametersSchema>
export type SystemNotFoundResponse = Static<typeof systemNotFoundResponseSchema>
export type SystemsResponse = Static<typeof systemsResponseSchema>
