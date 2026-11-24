import { type Static, Type } from '@sinclair/typebox'

const nullableUuidSchema = Type.Union([
  Type.String({ format: 'uuid' }),
  Type.Null(),
])
const nullableDateTimeSchema = Type.Union([
  Type.String({ format: 'date-time' }),
  Type.Null(),
])

const ticketPrioritySchema = Type.Union([
  Type.Literal('LOW'),
  Type.Literal('MEDIUM'),
  Type.Literal('HIGH'),
  Type.Literal('CRITICAL'),
])

const ticketStatusSchema = Type.Union([
  Type.Literal('OPEN'),
  Type.Literal('TRIAGED'),
  Type.Literal('IN_PROGRESS'),
  Type.Literal('WAITING_FOR_REQUESTER'),
  Type.Literal('RESOLVED'),
  Type.Literal('CLOSED'),
  Type.Literal('CANCELED'),
])

const ticketSourceSchema = Type.Union([
  Type.Literal('WEB'),
  Type.Literal('API'),
  Type.Literal('AGENT'),
])

export const ticketResponseSchema = Type.Object(
  {
    affectedSystemId: nullableUuidSchema,
    assigneeId: nullableUuidSchema,
    categoryId: nullableUuidSchema,
    closedAt: nullableDateTimeSchema,
    createdAt: Type.String({ format: 'date-time' }),
    description: Type.String(),
    dueAt: nullableDateTimeSchema,
    id: Type.String({ format: 'uuid' }),
    number: Type.Integer({ minimum: 1 }),
    previousDepartmentId: nullableUuidSchema,
    priority: ticketPrioritySchema,
    requestedActionId: nullableUuidSchema,
    requesterDepartmentId: nullableUuidSchema,
    requesterId: Type.String({ format: 'uuid' }),
    resolutionSummary: Type.Union([Type.String(), Type.Null()]),
    resolvedAt: nullableDateTimeSchema,
    source: ticketSourceSchema,
    status: ticketStatusSchema,
    teamId: nullableUuidSchema,
    title: Type.String(),
    updatedAt: Type.String({ format: 'date-time' }),
    version: Type.Integer({ minimum: 1 }),
  },
  { $id: 'TicketResponse', additionalProperties: false },
)

export const ticketsResponseSchema = Type.Object(
  {
    pagination: Type.Object(
      {
        hasNextPage: Type.Boolean(),
        hasPreviousPage: Type.Boolean(),
        page: Type.Integer({ minimum: 1 }),
        pageSize: Type.Integer({ minimum: 1 }),
        totalItems: Type.Integer({ minimum: 0 }),
        totalPages: Type.Integer({ minimum: 0 }),
      },
      { additionalProperties: false },
    ),
    tickets: Type.Array(ticketResponseSchema),
  },
  { $id: 'TicketsResponse', additionalProperties: false },
)

export const ticketsQuerySchema = Type.Object(
  {
    createdAtOrder: Type.Optional(
      Type.Union([Type.Literal('asc'), Type.Literal('desc')]),
    ),
    page: Type.Optional(Type.Integer({ minimum: 1 })),
    pageSize: Type.Optional(Type.Integer({ maximum: 100, minimum: 1 })),
  },
  { additionalProperties: false },
)

export const createTicketBodySchema = Type.Object(
  {
    description: Type.String({ minLength: 1 }),
    priority: Type.Optional(ticketPrioritySchema),
    requesterId: Type.String({ format: 'uuid' }),
    title: Type.String({ minLength: 1 }),
  },
  { additionalProperties: false },
)

export const ticketIdParametersSchema = Type.Object(
  { id: Type.String({ format: 'uuid' }) },
  { additionalProperties: false },
)

export const ticketNotFoundResponseSchema = Type.Object(
  { message: Type.String() },
  { $id: 'TicketNotFoundResponse', additionalProperties: false },
)

export const ticketsRouteSchema = {
  querystring: ticketsQuerySchema,
  response: { 200: ticketsResponseSchema },
} as const

export const ticketDetailsRouteSchema = {
  params: ticketIdParametersSchema,
  response: {
    200: ticketResponseSchema,
    404: ticketNotFoundResponseSchema,
  },
} as const

export const createTicketRouteSchema = {
  body: createTicketBodySchema,
  response: {
    201: ticketResponseSchema,
    404: ticketNotFoundResponseSchema,
  },
} as const

export type CreateTicketBody = Static<typeof createTicketBodySchema>
export type TicketIdParameters = Static<typeof ticketIdParametersSchema>
export type TicketNotFoundResponse = Static<typeof ticketNotFoundResponseSchema>
export type TicketResponse = Static<typeof ticketResponseSchema>
export type TicketsQuery = Static<typeof ticketsQuerySchema>
export type TicketsResponse = Static<typeof ticketsResponseSchema>
