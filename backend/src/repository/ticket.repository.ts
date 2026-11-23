import type { AppPrismaClient } from '../database/prisma.js'
import type { TicketPriority } from '../domain/ticket.domain.js'

import { Ticket } from '../domain/ticket.domain.js'

export interface CreateTicketData {
  description: string
  priority: TicketPriority
  requesterId: string
  title: string
}

export interface TicketRepository {
  create(data: CreateTicketData): Promise<Ticket>
  findById(id: string): Promise<null | Ticket>
  list(): Promise<Ticket[]>
}

export function createTicketRepository(
  prisma: AppPrismaClient,
): TicketRepository {

  async function create(data: CreateTicketData): Promise<Ticket> {
    const record = await prisma.ticket.create({
      data: {
        description: data.description,
        events: {
          create: {
            actorId: data.requesterId,
            payload: { source: 'API', status: 'OPEN' },
            type: 'CREATED',
          },
        },
        priority: data.priority,
        requesterId: data.requesterId,
        title: data.title,
      },
    })

    return Ticket.create(record)
  }

  async function findById(id: string): Promise<null | Ticket> {
    const record = await prisma.ticket.findUnique({ where: { id } })

    return record ? Ticket.create(record) : null
  }

  async function list(): Promise<Ticket[]> {
    const records = await prisma.ticket.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return records.map((record) => Ticket.create(record))
  }

  return { create, findById, list }
}
