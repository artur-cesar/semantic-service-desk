import { type Static, Type } from '@sinclair/typebox'

export const healthyResponseSchema = Type.Object(
  {
    database: Type.Literal('reachable'),
    status: Type.Literal('ok'),
  },
  {
    $id: 'HealthResponse',
    additionalProperties: false,
  },
)

export const unhealthyResponseSchema = Type.Object(
  {
    database: Type.Literal('unreachable'),
    status: Type.Literal('error'),
  },
  {
    $id: 'UnhealthyResponse',
    additionalProperties: false,
  },
)

export const healthResponseSchema = Type.Union([
  healthyResponseSchema,
  unhealthyResponseSchema,
])

export const healthRouteSchema = {
  response: {
    200: healthyResponseSchema,
    503: unhealthyResponseSchema,
  },
} as const

export type HealthResponse = Static<typeof healthResponseSchema>
