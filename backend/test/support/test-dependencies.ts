import type { Dependencies } from '../../src/bootstrap/dependencies.js'
import type { ActorRepository } from '../../src/repository/actor.repository.js'
import type { CapabilityRepository } from '../../src/repository/capability.repository.js'
import type { HealthRepository } from '../../src/repository/health.repository.js'
import type { ScenarioRepository } from '../../src/repository/scenario.repository.js'
import type { SystemRepository } from '../../src/repository/system.repository.js'
import type { TeamRepository } from '../../src/repository/team.repository.js'
import type { TicketRepository } from '../../src/repository/ticket.repository.js'

import { createActorController } from '../../src/controller/actor.controller.js'
import { createCapabilityController } from '../../src/controller/capability.controller.js'
import { createHealthController } from '../../src/controller/health.controller.js'
import { createScenarioController } from '../../src/controller/scenario.controller.js'
import { createSystemController } from '../../src/controller/system.controller.js'
import { createTeamController } from '../../src/controller/team.controller.js'
import { createTicketController } from '../../src/controller/ticket.controller.js'
import { Scenario } from '../../src/domain/scenario.domain.js'
import { createActorService } from '../../src/service/actor.service.js'
import { createCapabilityService } from '../../src/service/capability.service.js'
import { createHealthService } from '../../src/service/health.service.js'
import { createScenarioService } from '../../src/service/scenario.service.js'
import { createSystemService } from '../../src/service/system.service.js'
import { createTeamService } from '../../src/service/team.service.js'
import { createTicketService } from '../../src/service/ticket.service.js'

interface TestDependenciesOptions {
  actorRepository?: ActorRepository
  capabilityRepository?: CapabilityRepository
  healthRepository?: HealthRepository
  scenarioRepository?: ScenarioRepository
  systemRepository?: SystemRepository
  teamRepository?: TeamRepository
  ticketRepository?: TicketRepository
}

const defaultActorRepository: ActorRepository = {
  findById: () => Promise.resolve(null),
  list: () => Promise.resolve([]),
}

const defaultCapabilityRepository: CapabilityRepository = {
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

const defaultTeamRepository: TeamRepository = {
  findById: () => Promise.resolve(null),
  list: () => Promise.resolve([]),
}

const defaultSystemRepository: SystemRepository = {
  findById: () => Promise.resolve(null),
  list: () => Promise.resolve([]),
}

const defaultTicketRepository: TicketRepository = {
  create: () => Promise.reject(new Error('Unexpected ticket creation')),
  findById: () => Promise.resolve(null),
  list: () => Promise.resolve([]),
}

export function createTestDependencies(
  options: TestDependenciesOptions = {},
): Dependencies {
  const actorService = createActorService(
    options.actorRepository ?? defaultActorRepository,
  )
  const capabilityService = createCapabilityService(
    options.capabilityRepository ?? defaultCapabilityRepository,
  )
  const healthService = createHealthService(
    options.healthRepository ?? defaultHealthRepository,
  )
  const scenarioService = createScenarioService(
    options.scenarioRepository ?? defaultScenarioRepository,
  )
  const teamService = createTeamService(
    options.teamRepository ?? defaultTeamRepository,
  )
  const systemService = createSystemService(
    options.systemRepository ?? defaultSystemRepository,
  )
  const ticketService = createTicketService(
    options.ticketRepository ?? defaultTicketRepository,
    options.actorRepository ?? defaultActorRepository,
  )

  return {
    actorController: createActorController(actorService),
    capabilityController: createCapabilityController(capabilityService),
    dispose: () => Promise.resolve(),
    healthController: createHealthController(healthService),
    scenarioController: createScenarioController(scenarioService),
    systemController: createSystemController(systemService),
    teamController: createTeamController(teamService),
    ticketController: createTicketController(ticketService),
  }
}
