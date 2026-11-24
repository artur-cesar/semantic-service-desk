import type { Ticket, TicketPriority } from '../domain/ticket.domain.js'
import type { ActorRepository } from '../repository/actor.repository.js'
import type {
  ConfirmTicketResult,
  ListTicketsOptions,
  TicketPage,
  TicketRepository,
} from '../repository/ticket.repository.js'

export interface CreateTicketInput {
  description: string
  priority: TicketPriority
  requesterId: string
  title: string
}

export interface TicketService {
  confirm(id: string): Promise<ConfirmTicketResult>
  create(input: CreateTicketInput): Promise<null | Ticket>
  findById(id: string): Promise<null | Ticket>
  list(options: ListTicketsOptions): Promise<TicketPage>
}

export function createTicketService(
  ticketRepository: TicketRepository,
  actorRepository: ActorRepository,
): TicketService {
  return {
    confirm: (id) => ticketRepository.confirm(id),
    async create(input) {
      const requester = await actorRepository.findById(input.requesterId)

      if (!requester) {
        return null
      }

      return ticketRepository.create(input)
    },
    findById: (id) => ticketRepository.findById(id),
    list: (options) => ticketRepository.list(options),
  }
}
