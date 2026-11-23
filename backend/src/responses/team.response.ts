import { type Static, Type } from '@sinclair/typebox'

const departmentResponseSchema = Type.Object(
  {
    code: Type.String(),
    description: Type.Union([Type.String(), Type.Null()]),
    id: Type.String({ format: 'uuid' }),
    name: Type.String(),
  },
  { additionalProperties: false },
)

const teamResponseSchema = Type.Object(
  {
    code: Type.String(),
    department: departmentResponseSchema,
    description: Type.Union([Type.String(), Type.Null()]),
    id: Type.String({ format: 'uuid' }),
    membersCount: Type.Integer({ minimum: 0 }),
    name: Type.String(),
  },
  { additionalProperties: false },
)

const teamMemberResponseSchema = Type.Object(
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
    endedAt: Type.Union([Type.String({ format: 'date-time' }), Type.Null()]),
    id: Type.String({ format: 'uuid' }),
    isCurrent: Type.Boolean(),
    startedAt: Type.String({ format: 'date-time' }),
  },
  { additionalProperties: false },
)

export const teamsResponseSchema = Type.Object(
  { teams: Type.Array(teamResponseSchema) },
  { $id: 'TeamsResponse', additionalProperties: false },
)

export const teamDetailsResponseSchema = Type.Object(
  {
    code: Type.String(),
    department: departmentResponseSchema,
    description: Type.Union([Type.String(), Type.Null()]),
    id: Type.String({ format: 'uuid' }),
    members: Type.Array(teamMemberResponseSchema),
    name: Type.String(),
  },
  { $id: 'TeamDetailsResponse', additionalProperties: false },
)

export const teamNotFoundResponseSchema = Type.Object(
  { message: Type.String() },
  { $id: 'TeamNotFoundResponse', additionalProperties: false },
)

export const teamIdParametersSchema = Type.Object(
  { id: Type.String({ format: 'uuid' }) },
  { additionalProperties: false },
)

export const teamsRouteSchema = {
  response: { 200: teamsResponseSchema },
} as const

export const teamDetailsRouteSchema = {
  params: teamIdParametersSchema,
  response: {
    200: teamDetailsResponseSchema,
    404: teamNotFoundResponseSchema,
  },
} as const

export type TeamDetailsResponse = Static<typeof teamDetailsResponseSchema>
export type TeamIdParameters = Static<typeof teamIdParametersSchema>
export type TeamNotFoundResponse = Static<typeof teamNotFoundResponseSchema>
export type TeamsResponse = Static<typeof teamsResponseSchema>
