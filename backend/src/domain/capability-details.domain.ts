import type { CapabilityActor } from './capability-actor.domain.js'
import type { Capability } from './capability.domain.js'

export interface CapabilityDetailsProperties {
  actors: CapabilityActor[]
  capability: Capability
}

export class CapabilityDetails {
  get actors() {
    return this.properties.actors
  }
  get capability() {
    return this.properties.capability
  }
  private constructor(
    private readonly properties: CapabilityDetailsProperties,
  ) {}
  static create(properties: CapabilityDetailsProperties): CapabilityDetails {
    return new CapabilityDetails(properties)
  }
}
