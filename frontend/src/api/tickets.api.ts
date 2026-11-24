import { getJson, postJson } from './api-client.js'

export interface CreateTicketRequest {
  description: string
  priority: TicketPriority
  requesterId: string
  title: string
}

export interface GetTicketsParameters {
  createdAtOrder: 'asc' | 'desc'
  page: number
  pageSize: number
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

export interface TicketsResponse {
  pagination: {
    hasNextPage: boolean
    hasPreviousPage: boolean
    page: number
    pageSize: number
    totalItems: number
    totalPages: number
  }
  tickets: TicketResponse[]
}

export function createTicket(
  request: CreateTicketRequest,
): Promise<TicketResponse> {
  return postJson<TicketResponse, CreateTicketRequest>('/tickets', request)
}

export function getTickets(
  parameters: GetTicketsParameters,
): Promise<TicketsResponse> {
  const query = new URLSearchParams({
    createdAtOrder: parameters.createdAtOrder,
    page: String(parameters.page),
    pageSize: String(parameters.pageSize),
  })

  return getJson<TicketsResponse>(`/tickets?${query.toString()}`)
}
