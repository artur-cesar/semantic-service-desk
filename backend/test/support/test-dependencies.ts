import type { Dependencies } from '../../src/bootstrap/dependencies.js'
import type { ActorRepository } from '../../src/repository/actor.repository.js'
import type { HealthRepository } from '../../src/repository/health.repository.js'
import type { ScenarioRepository } from '../../src/repository/scenario.repository.js'

import { createActorController } from '../../src/controller/actor.controller.js'
import { createHealthController } from '../../src/controller/health.controller.js'
import { createScenarioController } from '../../src/controller/scenario.controller.js'
import { Scenario } from '../../src/domain/scenario.domain.js'
import { createActorService } from '../../src/service/actor.service.js'
import { createHealthService } from '../../src/service/health.service.js'
import { createScenarioService } from '../../src/service/scenario.service.js'

interface TestDependenciesOptions {
  actorRepository?: ActorRepository
  healthRepository?: HealthRepository
  scenarioRepository?: ScenarioRepository
}

const defaultActorRepository: ActorRepository = {
  findById: () => Promise.resolve(null),
  list: () => Promise.resolve([]),
}

const defaultHealthRepository: HealthRepository = {
  checkDatabase: () => Promise.resolve(),
}

const defaultScenarioRepository: ScenarioRepository = {
  getScenario: () =>
    Promise.resolve(
      Scenario.create({
        actors: [],
        capabilities: [],
        categories: [],
        departments: [],
        systems: [],
        teams: [],
      }),
    ),
}

export function createTestDependencies(
  options: TestDependenciesOptions = {},
): Dependencies {
  const actorService = createActorService(
    options.actorRepository ?? defaultActorRepository,
  )
  const healthService = createHealthService(
    options.healthRepository ?? defaultHealthRepository,
  )
  const scenarioService = createScenarioService(
    options.scenarioRepository ?? defaultScenarioRepository,
  )

  return {
    actorController: createActorController(actorService),
    dispose: () => Promise.resolve(),
    healthController: createHealthController(healthService),
    scenarioController: createScenarioController(scenarioService),
  }
}
