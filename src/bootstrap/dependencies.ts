import type { Environment } from '../config/environment.js'

import { createHealthController } from '../controller/health.controller.js'
import { createPrismaClient } from '../database/prisma.js'
import { createHealthRepository } from '../repository/health.repository.js'
import { createHealthService } from '../service/health.service.js'

export type Dependencies = ReturnType<typeof createDependencies>

export function createDependencies(environment: Environment) {
  const prisma = createPrismaClient(environment.databaseUrl)
  const healthRepository = createHealthRepository(prisma)
  const healthService = createHealthService(healthRepository)
  const healthController = createHealthController(healthService)

  async function dispose(): Promise<void> {
    await prisma.$disconnect()
  }

  return {
    dispose,
    healthController,
  }
}
