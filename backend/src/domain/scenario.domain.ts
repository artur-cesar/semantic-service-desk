import type { Actor } from './actor.domain.js'
import type { BusinessSystem } from './business-system.domain.js'
import type { Capability } from './capability.domain.js'
import type { Department } from './department.domain.js'
import type { Team } from './team.domain.js'
import type { TicketCategory } from './ticket-category.domain.js'

export interface ScenarioProperties {
  actors: Actor[]
  capabilities: Capability[]
  categories: TicketCategory[]
  departments: Department[]
  systems: BusinessSystem[]
  teams: Team[]
}

export class Scenario {
  get actors() {
    return this.properties.actors
  }

  get capabilities() {
    return this.properties.capabilities
  }

  get categories() {
    return this.properties.categories
  }
  get departments() {
    return this.properties.departments
  }
  get systems() {
    return this.properties.systems
  }
  get teams() {
    return this.properties.teams
  }
  private constructor(private readonly properties: ScenarioProperties) {}
  static create(properties: ScenarioProperties): Scenario {
    return new Scenario(properties)
  }
}
