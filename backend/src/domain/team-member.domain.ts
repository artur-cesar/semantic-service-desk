import type { ActorType } from './actor.domain.js'

export interface TeamMemberProperties {
  actorActive: boolean
  actorEmail: null | string
  actorId: string
  actorName: string
  actorType: ActorType
  createdAt: Date
  endedAt: Date | null
  id: string
  startedAt: Date
}

export class TeamMember {
  get actorActive() {
    return this.properties.actorActive
  }
  get actorEmail() {
    return this.properties.actorEmail
  }
  get actorId() {
    return this.properties.actorId
  }
  get actorName() {
    return this.properties.actorName
  }
  get actorType() {
    return this.properties.actorType
  }
  get createdAt() {
    return this.properties.createdAt
  }
  get endedAt() {
    return this.properties.endedAt
  }
  get id() {
    return this.properties.id
  }
  get isCurrent() {
    return this.properties.endedAt === null && this.properties.actorActive
  }
  get startedAt() {
    return this.properties.startedAt
  }
  private constructor(private readonly properties: TeamMemberProperties) {}
  static create(properties: TeamMemberProperties): TeamMember {
    return new TeamMember(properties)
  }
}
