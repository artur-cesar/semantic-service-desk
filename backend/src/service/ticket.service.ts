import type { Ticket, TicketPriority } from '../domain/ticket.domain.js'
import type { ActorRepository } from '../repository/actor.repository.js'
import type { TicketRepository } from '../repository/ticket.repository.js'

export interface CreateTicketInput {
  description: string
  priority: TicketPriority
  requesterId: string
  title: string
}

export interface TicketService {
  create(input: CreateTicketInput): Promise<null | Ticket>
  findById(id: string): Promise<null | Ticket>
  list(): Promise<Ticket[]>
}

export function createTicketService(
  ticketRepository: TicketRepository,
  actorRepository: ActorRepository,
): TicketService {
  return {
    async create(input) {
      const requester = await actorRepository.findById(input.requesterId)

      if (!requester) {
        return null
      }

      return ticketRepository.create(input)
    },
    findById: (id) => ticketRepository.findById(id),
    list: () => ticketRepository.list(),
  }
}
