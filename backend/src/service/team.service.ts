import type { TeamDetails } from '../domain/team-details.domain.js'
import type { TeamRepository } from '../repository/team.repository.js'

export class TeamService {
  constructor(private readonly repository: TeamRepository) {}

  findById(id: string): Promise<null | TeamDetails> {
    return this.repository.findById(id)
  }

  list(): Promise<TeamDetails[]> {
    return this.repository.list()
  }
}
