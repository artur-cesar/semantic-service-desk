import type { TeamDetails } from '../domain/team-details.domain.js'
import type { TeamRepository } from '../repository/team.repository.js'

export interface TeamService {
  findById(id: string): Promise<null | TeamDetails>
  list(): Promise<TeamDetails[]>
}

export function createTeamService(repository: TeamRepository): TeamService {
  return {
    findById: (id) => repository.findById(id),
    list: () => repository.list(),
  }
}
