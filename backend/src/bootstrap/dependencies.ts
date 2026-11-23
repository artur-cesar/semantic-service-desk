import type { Environment } from '../config/environment.js'

import { createActorController } from '../controller/actor.controller.js'
import { createHealthController } from '../controller/health.controller.js'
import { createScenarioController } from '../controller/scenario.controller.js'
import { createPrismaClient } from '../database/prisma.js'
import { createActorRepository } from '../repository/actor.repository.js'
import { createHealthRepository } from '../repository/health.repository.js'
import { createScenarioRepository } from '../repository/scenario.repository.js'
import { createActorService } from '../service/actor.service.js'
import { createHealthService } from '../service/health.service.js'
import { createScenarioService } from '../service/scenario.service.js'

export type Dependencies = ReturnType<typeof createDependencies>

export function createDependencies(environment: Environment) {
  const prisma = createPrismaClient(environment.databaseUrl)
  const healthRepository = createHealthRepository(prisma)
  const healthService = createHealthService(healthRepository)
  const healthController = createHealthController(healthService)
  
  //Scenarios
  const scenarioRepository = createScenarioRepository(prisma)
  const scenarioService = createScenarioService(scenarioRepository)
  const scenarioController = createScenarioController(scenarioService)

  //Actorss
  const actorRepository = createActorRepository(prisma)
  const actorService = createActorService(actorRepository)
  const actorController = createActorController(actorService)

  async function dispose(): Promise<void> {
    await prisma.$disconnect()
  }

  return {
    actorController,
    dispose,
    healthController,
    scenarioController,
  }
}
