import type { FastifyReply, FastifyRequest } from 'fastify'

import type { Ticket } from '../domain/ticket.domain.js'
import type {
  CreateTicketBody,
  TicketIdParameters,
  TicketNotFoundResponse,
  TicketResponse,
  TicketsQuery,
  TicketsResponse,
} from '../responses/ticket.response.js'
import type { TicketService } from '../service/ticket.service.js'

export type TicketController = ReturnType<typeof createTicketController>

export function createTicketController(service: TicketService) {
  async function create(
    request: FastifyRequest<{ Body: CreateTicketBody }>,
    reply: FastifyReply,
  ): Promise<TicketNotFoundResponse | TicketResponse> {
    const ticket = await service.create({
      description: request.body.description,
      priority: request.body.priority ?? 'MEDIUM',
      requesterId: request.body.requesterId,
      title: request.body.title,
    })

    if (!ticket) {
      return reply.code(404).send({ message: 'Requester not found' })
    }

    return reply.code(201).send(toResponse(ticket))
  }

  async function findById(
    request: FastifyRequest<{ Params: TicketIdParameters }>,
    reply: FastifyReply,
  ): Promise<TicketNotFoundResponse | TicketResponse> {
    const ticket = await service.findById(request.params.id)

    if (!ticket) {
      return reply.code(404).send({ message: 'Ticket not found' })
    }

    return toResponse(ticket)
  }

  async function list(
    request: FastifyRequest<{ Querystring: TicketsQuery }>,
  ): Promise<TicketsResponse> {
    const createdAtOrder = request.query.createdAtOrder ?? 'desc'
    const page = request.query.page ?? 1
    const pageSize = request.query.pageSize ?? 20
    const result = await service.list({ createdAtOrder, page, pageSize })
    const totalPages = Math.ceil(result.totalItems / pageSize)

    return {
      pagination: {
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
        page,
        pageSize,
        totalItems: result.totalItems,
        totalPages,
      },
      tickets: result.tickets.map(toResponse),
    }
  }

  return { create, findById, list }
}

function toResponse(ticket: Ticket): TicketResponse {
  return {
    affectedSystemId: ticket.affectedSystemId,
    assigneeId: ticket.assigneeId,
    categoryId: ticket.categoryId,
    closedAt: ticket.closedAt?.toISOString() ?? null,
    createdAt: ticket.createdAt.toISOString(),
    description: ticket.description,
    dueAt: ticket.dueAt?.toISOString() ?? null,
    id: ticket.id,
    number: ticket.number,
    previousDepartmentId: ticket.previousDepartmentId,
    priority: ticket.priority,
    requestedActionId: ticket.requestedActionId,
    requesterDepartmentId: ticket.requesterDepartmentId,
    requesterId: ticket.requesterId,
    resolutionSummary: ticket.resolutionSummary,
    resolvedAt: ticket.resolvedAt?.toISOString() ?? null,
    source: ticket.source,
    status: ticket.status,
    teamId: ticket.teamId,
    title: ticket.title,
    updatedAt: ticket.updatedAt.toISOString(),
    version: ticket.version,
  }
}
