import type { ActorType } from './actor.domain.js'

export interface CapabilityActorProperties {
  actorActive: boolean
  actorEmail: null | string
  actorId: string
  actorName: string
  actorType: ActorType
  createdAt: Date
  grantedAt: Date
  id: string
  revokedAt: Date | null
}

export class CapabilityActor {
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
  get grantedAt() {
    return this.properties.grantedAt
  }
  get id() {
    return this.properties.id
  }
  get isCurrent() {
    return this.properties.revokedAt === null && this.properties.actorActive
  }
  get revokedAt() {
    return this.properties.revokedAt
  }
  private constructor(private readonly properties: CapabilityActorProperties) {}
  static create(properties: CapabilityActorProperties): CapabilityActor {
    return new CapabilityActor(properties)
  }
}
