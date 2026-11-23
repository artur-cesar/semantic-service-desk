import type { SystemDetails } from '../domain/system-details.domain.js'
import type { SystemRepository } from '../repository/system.repository.js'

export interface SystemService {
  findById(id: string): Promise<null | SystemDetails>
  list(): Promise<SystemDetails[]>
}

export function createSystemService(
  repository: SystemRepository,
): SystemService {
  return {
    findById: (id) => repository.findById(id),
    list: () => repository.list(),
  }
}
