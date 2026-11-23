import type { HealthRepository } from '../repository/health.repository.js'

export interface HealthService {
  checkDatabase(): Promise<void>
}

export function createHealthService(
  repository: HealthRepository,
): HealthService {
  async function checkDatabase(): Promise<void> {
    await repository.checkDatabase()
  }

  return {
    checkDatabase,
  }
}
