import type { BusinessSystem } from './business-system.domain.js'

export interface ActorSystemAuthorizationProperties {
  createdAt: Date
  grantedAt: Date
  id: string
  revokedAt: Date | null
  system: BusinessSystem
}

export class ActorSystemAuthorization {
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
  get system() {
    return this.properties.system
  }
  private constructor(
    private readonly properties: ActorSystemAuthorizationProperties,
  ) {}
  static create(
    properties: ActorSystemAuthorizationProperties,
  ): ActorSystemAuthorization {
    return new ActorSystemAuthorization(properties)
  }
}
