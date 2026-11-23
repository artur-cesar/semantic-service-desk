import { type Static, Type } from '@sinclair/typebox'

const referenceProperties = {
  code: Type.String(),
  id: Type.String({ format: 'uuid' }),
  name: Type.String(),
}

const resourceProperties = {
  ...referenceProperties,
  description: Type.Union([Type.String(), Type.Null()]),
}

const referenceResponseSchema = Type.Object(referenceProperties, {
  additionalProperties: false,
})

const resourceResponseSchema = Type.Object(resourceProperties, {
  additionalProperties: false,
})

const actorResponseSchema = Type.Object(
  {
    authorizedSystems: Type.Array(referenceResponseSchema),
    capabilities: Type.Array(referenceResponseSchema),
    department: referenceResponseSchema,
    email: Type.Union([Type.String({ format: 'email' }), Type.Null()]),
    id: Type.String({ format: 'uuid' }),
    name: Type.String(),
    teams: Type.Array(referenceResponseSchema),
    type: Type.Union([
      Type.Literal('HUMAN'),
      Type.Literal('AI_AGENT'),
      Type.Literal('SERVICE'),
    ]),
  },
  { additionalProperties: false },
)

const categoryResponseSchema = Type.Object(
  {
    ...resourceProperties,
    parentId: Type.Union([Type.String({ format: 'uuid' }), Type.Null()]),
  },
  { additionalProperties: false },
)

const systemResponseSchema = Type.Object(
  {
    ...resourceProperties,
    actions: Type.Array(resourceResponseSchema),
  },
  { additionalProperties: false },
)

const teamResponseSchema = Type.Object(
  {
    ...resourceProperties,
    department: referenceResponseSchema,
  },
  { additionalProperties: false },
)

export const scenarioResponseSchema = Type.Object(
  {
    actors: Type.Array(actorResponseSchema),
    capabilities: Type.Array(resourceResponseSchema),
    categories: Type.Array(categoryResponseSchema),
    departments: Type.Array(resourceResponseSchema),
    systems: Type.Array(systemResponseSchema),
    teams: Type.Array(teamResponseSchema),
  },
  {
    $id: 'ScenarioResponse',
    additionalProperties: false,
  },
)

export const scenarioRouteSchema = {
  response: {
    200: scenarioResponseSchema,
  },
} as const

export type ScenarioResponse = Static<typeof scenarioResponseSchema>
