import type { Team } from './team.domain.js'

export interface TeamMembershipProperties {
  createdAt: Date
  endedAt: Date | null
  id: string
  startedAt: Date
  team: Team
}

export class TeamMembership {
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
    return this.properties.endedAt === null
  }
  get startedAt() {
    return this.properties.startedAt
  }
  get team() {
    return this.properties.team
  }
  private constructor(private readonly properties: TeamMembershipProperties) {}
  static create(properties: TeamMembershipProperties): TeamMembership {
    return new TeamMembership(properties)
  }
}
