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

export class TicketService {
  constructor(
    private readonly ticketRepository: TicketRepository,
    private readonly actorRepository: ActorRepository,
  ) {}

  confirm(id: string): Promise<ConfirmTicketResult> {
    return this.ticketRepository.confirm(id)
  }

  async create(input: CreateTicketInput): Promise<null | Ticket> {
    const requester = await this.actorRepository.findById(input.requesterId)

    if (!requester) {
      return null
    }

    return this.ticketRepository.create(input)
  }

  findById(id: string): Promise<null | Ticket> {
    return this.ticketRepository.findById(id)
  }

  list(options: ListTicketsOptions): Promise<TicketPage> {
    return this.ticketRepository.list(options)
  }
}
