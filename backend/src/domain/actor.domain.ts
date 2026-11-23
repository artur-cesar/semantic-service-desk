import type { ActorCapability } from './actor-capability.domain.js'
import type { ActorSystemAuthorization } from './actor-system-authorization.domain.js'
import type { Department } from './department.domain.js'
import type { TeamMembership } from './team-membership.domain.js'

export interface ActorProperties {
  active: boolean
  authorizations: ActorSystemAuthorization[]
  capabilities: ActorCapability[]
  createdAt: Date
  department: Department
  email: null | string
  id: string
  memberships: TeamMembership[]
  name: string
  type: ActorType
  updatedAt: Date
}

export type ActorType = 'AI_AGENT' | 'HUMAN' | 'SERVICE'

export class Actor {
  get active() {
    return this.properties.active
  }

  get authorizations() {
    return this.properties.authorizations
  }

  get capabilities() {
    return this.properties.capabilities
  }
  get createdAt() {
    return this.properties.createdAt
  }
  get department() {
    return this.properties.department
  }
  get email() {
    return this.properties.email
  }
  get id() {
    return this.properties.id
  }
  get memberships() {
    return this.properties.memberships
  }
  get name() {
    return this.properties.name
  }
  get type() {
    return this.properties.type
  }
  get updatedAt() {
    return this.properties.updatedAt
  }
  private constructor(private readonly properties: ActorProperties) {}
  static create(properties: ActorProperties): Actor {
    return new Actor(properties)
  }
}
