import type { BusinessSystem } from './business-system.domain.js'
import type { SystemAuthorizedActor } from './system-authorized-actor.domain.js'

export interface SystemDetailsProperties {
  authorizedActors: SystemAuthorizedActor[]
  system: BusinessSystem
}

export class SystemDetails {
  get authorizedActors() {
    return this.properties.authorizedActors
  }
  get system() {
    return this.properties.system
  }
  private constructor(private readonly properties: SystemDetailsProperties) {}
  static create(properties: SystemDetailsProperties): SystemDetails {
    return new SystemDetails(properties)
  }
}
