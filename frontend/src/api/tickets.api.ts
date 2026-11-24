import { postJson } from './api-client.js'

export interface CreateTicketRequest {
  description: string
  priority: TicketPriority
  requesterId: string
  title: string
}

export type TicketPriority = 'CRITICAL' | 'HIGH' | 'LOW' | 'MEDIUM'

export interface TicketResponse {
  affectedSystemId: null | string
  assigneeId: null | string
  categoryId: null | string
  closedAt: null | string
  createdAt: string
  description: string
  dueAt: null | string
  id: string
  number: number
  previousDepartmentId: null | string
  priority: TicketPriority
  requestedActionId: null | string
  requesterDepartmentId: null | string
  requesterId: string
  resolutionSummary: null | string
  resolvedAt: null | string
  source: 'AGENT' | 'API' | 'WEB'
  status:
    | 'CANCELED'
    | 'CLOSED'
    | 'IN_PROGRESS'
    | 'OPEN'
    | 'RESOLVED'
    | 'TRIAGED'
    | 'WAITING_FOR_REQUESTER'
  teamId: null | string
  title: string
  updatedAt: string
  version: number
}

export function createTicket(
  request: CreateTicketRequest,
): Promise<TicketResponse> {
  return postJson<TicketResponse, CreateTicketRequest>('/tickets', request)
}
