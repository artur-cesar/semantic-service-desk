import type { TeamMember } from './team-member.domain.js'
import type { Team } from './team.domain.js'

export interface TeamDetailsProperties {
  members: TeamMember[]
  team: Team
}

export class TeamDetails {
  get members() {
    return this.properties.members
  }
  get team() {
    return this.properties.team
  }
  private constructor(private readonly properties: TeamDetailsProperties) {}
  static create(properties: TeamDetailsProperties): TeamDetails {
    return new TeamDetails(properties)
  }
}
