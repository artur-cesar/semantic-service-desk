import type { CapabilityDetails } from '../domain/capability-details.domain.js'
import type { CapabilityRepository } from '../repository/capability.repository.js'

export interface CapabilityService {
  findById(id: string): Promise<CapabilityDetails | null>
  list(): Promise<CapabilityDetails[]>
}

export function createCapabilityService(
  repository: CapabilityRepository,
): CapabilityService {
  return {
    findById: (id) => repository.findById(id),
    list: () => repository.list(),
  }
}
