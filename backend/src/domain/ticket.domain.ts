export type TicketPriority = 'CRITICAL' | 'HIGH' | 'LOW' | 'MEDIUM'
export interface TicketProperties {
  affectedSystemId: null | string
  assigneeId: null | string
  categoryId: null | string
  closedAt: Date | null
  createdAt: Date
  description: string
  dueAt: Date | null
  id: string
  number: number
  previousDepartmentId: null | string
  priority: TicketPriority
  requestedActionId: null | string
  requesterDepartmentId: null | string
  requesterId: string
  resolutionSummary: null | string
  resolvedAt: Date | null
  source: TicketSource
  status: TicketStatus
  teamId: null | string
  title: string
  updatedAt: Date
  version: number
}
export type TicketSource = 'AGENT' | 'API' | 'WEB'

export type TicketStatus =
  | 'CANCELED'
  | 'CLOSED'
  | 'DRAFT'
  | 'IN_PROGRESS'
  | 'OPEN'
  | 'RESOLVED'
  | 'TRIAGED'
  | 'WAITING_FOR_REQUESTER'

export class Ticket {
  get affectedSystemId() {
    return this.properties.affectedSystemId
  }
  get assigneeId() {
    return this.properties.assigneeId
  }
  get categoryId() {
    return this.properties.categoryId
  }
  get closedAt() {
    return this.properties.closedAt
  }
  get createdAt() {
    return this.properties.createdAt
  }
  get description() {
    return this.properties.description
  }
  get dueAt() {
    return this.properties.dueAt
  }
  get id() {
    return this.properties.id
  }
  get number() {
    return this.properties.number
  }
  get previousDepartmentId() {
    return this.properties.previousDepartmentId
  }
  get priority() {
    return this.properties.priority
  }
  get requestedActionId() {
    return this.properties.requestedActionId
  }
  get requesterDepartmentId() {
    return this.properties.requesterDepartmentId
  }
  get requesterId() {
    return this.properties.requesterId
  }
  get resolutionSummary() {
    return this.properties.resolutionSummary
  }
  get resolvedAt() {
    return this.properties.resolvedAt
  }
  get source() {
    return this.properties.source
  }
  get status() {
    return this.properties.status
  }
  get teamId() {
    return this.properties.teamId
  }
  get title() {
    return this.properties.title
  }
  get updatedAt() {
    return this.properties.updatedAt
  }
  get version() {
    return this.properties.version
  }
  private constructor(private readonly properties: TicketProperties) {}
  static create(properties: TicketProperties): Ticket {
    return new Ticket(properties)
  }
}
