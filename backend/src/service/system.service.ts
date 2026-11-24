import type { SystemDetails } from '../domain/system-details.domain.js'
import type { SystemRepository } from '../repository/system.repository.js'

export class SystemService {
  constructor(private readonly repository: SystemRepository) {}

  findById(id: string): Promise<null | SystemDetails> {
    return this.repository.findById(id)
  }

  list(): Promise<SystemDetails[]> {
    return this.repository.list()
  }
}
