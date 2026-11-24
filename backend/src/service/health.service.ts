import type { HealthRepository } from '../repository/health.repository.js'

export class HealthService {
  constructor(private readonly repository: HealthRepository) {}

  async checkDatabase(): Promise<void> {
    await this.repository.checkDatabase()
  }
}
