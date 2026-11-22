import { type Static, Type } from '@sinclair/typebox'

export const healthResponseSchema = Type.Object(
  {
    status: Type.Literal('ok'),
  },
  {
    $id: 'HealthResponse',
    additionalProperties: false,
  },
)

export const healthRouteSchema = {
  response: {
    200: healthResponseSchema,
  },
} as const

export type HealthResponse = Static<typeof healthResponseSchema>
