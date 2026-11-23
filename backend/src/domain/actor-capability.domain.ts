import type { Capability } from './capability.domain.js'

export interface ActorCapabilityProperties {
  capability: Capability
  createdAt: Date
  grantedAt: Date
  id: string
  revokedAt: Date | null
}

export class ActorCapability {
  get capability() {
    return this.properties.capability
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
    return this.properties.revokedAt === null
  }
  get revokedAt() {
    return this.properties.revokedAt
  }
  private constructor(private readonly properties: ActorCapabilityProperties) {}
  static create(properties: ActorCapabilityProperties): ActorCapability {
    return new ActorCapability(properties)
  }
}
