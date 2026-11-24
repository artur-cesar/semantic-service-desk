import type { AppPrismaClient } from '../database/prisma.js'
import type { TicketPriority } from '../domain/ticket.domain.js'

import { Ticket } from '../domain/ticket.domain.js'

export type ConfirmTicketResult =
  | { outcome: 'confirmed'; ticket: Ticket }
  | { outcome: 'not_draft' }
  | { outcome: 'not_found' }

export interface CreateTicketData {
  description: string
  priority: TicketPriority
  requesterId: string
  title: string
}

export interface ListTicketsOptions {
  createdAtOrder: 'asc' | 'desc'
  page: number
  pageSize: number
}

export interface TicketPage {
  tickets: Ticket[]
  totalItems: number
}

export interface TicketRepository {
  confirm(id: string): Promise<ConfirmTicketResult>
  create(data: CreateTicketData): Promise<Ticket>
  findById(id: string): Promise<null | Ticket>
  list(options: ListTicketsOptions): Promise<TicketPage>
}

export class PrismaTicketRepository implements TicketRepository {
  constructor(private readonly prisma: AppPrismaClient) {}

  async confirm(id: string): Promise<ConfirmTicketResult> {
    return this.prisma.$transaction(async (transaction) => {
      const update = await transaction.ticket.updateMany({
        data: {
          status: 'OPEN',
          version: { increment: 1 },
        },
        where: { id, status: 'DRAFT' },
      })

      if (update.count === 0) {
        const existing = await transaction.ticket.findUnique({
          select: { id: true },
          where: { id },
        })

        return existing ? { outcome: 'not_draft' } : { outcome: 'not_found' }
      }

      await transaction.ticketEvent.create({
        data: {
          payload: { from: 'DRAFT', to: 'OPEN' },
          ticketId: id,
          type: 'STATUS_CHANGED',
        },
      })

      const record = await transaction.ticket.findUniqueOrThrow({
        where: { id },
      })

      return { outcome: 'confirmed', ticket: Ticket.create(record) }
    })
  }

  async create(data: CreateTicketData): Promise<Ticket> {
    const record = await this.prisma.ticket.create({
      data: {
        description: data.description,
        events: {
          create: {
            actorId: data.requesterId,
            payload: { source: 'API', status: 'DRAFT' },
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

  async findById(id: string): Promise<null | Ticket> {
    const record = await this.prisma.ticket.findUnique({ where: { id } })

    return record ? Ticket.create(record) : null
  }

  async list(options: ListTicketsOptions): Promise<TicketPage> {
    const [totalItems, records] = await this.prisma.$transaction([
      this.prisma.ticket.count(),
      this.prisma.ticket.findMany({
        orderBy: [
          { createdAt: options.createdAtOrder },
          { number: options.createdAtOrder },
        ],
        skip: (options.page - 1) * options.pageSize,
        take: options.pageSize,
      }),
    ])

    return {
      tickets: records.map((record) => Ticket.create(record)),
      totalItems,
    }
  }
}
