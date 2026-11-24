import type { CapabilityDetails } from '../domain/capability-details.domain.js'
import type { CapabilityRepository } from '../repository/capability.repository.js'

export class CapabilityService {
  constructor(private readonly repository: CapabilityRepository) {}

  findById(id: string): Promise<CapabilityDetails | null> {
    return this.repository.findById(id)
  }

  list(): Promise<CapabilityDetails[]> {
    return this.repository.list()
  }
}
