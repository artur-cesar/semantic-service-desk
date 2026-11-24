import type { Dependencies } from '../../src/bootstrap/dependencies.js'
import type { ActorRepository } from '../../src/repository/actor.repository.js'
import type { CapabilityRepository } from '../../src/repository/capability.repository.js'
import type { HealthRepository } from '../../src/repository/health.repository.js'
import type { ScenarioRepository } from '../../src/repository/scenario.repository.js'
import type { SystemRepository } from '../../src/repository/system.repository.js'
import type { TeamRepository } from '../../src/repository/team.repository.js'
import type { TicketRepository } from '../../src/repository/ticket.repository.js'

import { ActorController } from '../../src/controller/actor.controller.js'
import { CapabilityController } from '../../src/controller/capability.controller.js'
import { HealthController } from '../../src/controller/health.controller.js'
import { ScenarioController } from '../../src/controller/scenario.controller.js'
import { SystemController } from '../../src/controller/system.controller.js'
import { TeamController } from '../../src/controller/team.controller.js'
import { TicketController } from '../../src/controller/ticket.controller.js'
import { Scenario } from '../../src/domain/scenario.domain.js'
import { ActorService } from '../../src/service/actor.service.js'
import { CapabilityService } from '../../src/service/capability.service.js'
import { HealthService } from '../../src/service/health.service.js'
import { ScenarioService } from '../../src/service/scenario.service.js'
import { SystemService } from '../../src/service/system.service.js'
import { TeamService } from '../../src/service/team.service.js'
import { TicketService } from '../../src/service/ticket.service.js'

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
  confirm: () => Promise.resolve({ outcome: 'not_found' }),
  create: () => Promise.reject(new Error('Unexpected ticket creation')),
  findById: () => Promise.resolve(null),
  list: () => Promise.resolve({ tickets: [], totalItems: 0 }),
}

export function createTestDependencies(
  options: TestDependenciesOptions = {},
): Dependencies {
  const actorService = new ActorService(
    options.actorRepository ?? defaultActorRepository,
  )
  const capabilityService = new CapabilityService(
    options.capabilityRepository ?? defaultCapabilityRepository,
  )
  const healthService = new HealthService(
    options.healthRepository ?? defaultHealthRepository,
  )
  const scenarioService = new ScenarioService(
    options.scenarioRepository ?? defaultScenarioRepository,
  )
  const teamService = new TeamService(
    options.teamRepository ?? defaultTeamRepository,
  )
  const systemService = new SystemService(
    options.systemRepository ?? defaultSystemRepository,
  )
  const ticketService = new TicketService(
    options.ticketRepository ?? defaultTicketRepository,
    options.actorRepository ?? defaultActorRepository,
  )

  return {
    actorController: new ActorController(actorService),
    capabilityController: new CapabilityController(capabilityService),
    dispose: () => Promise.resolve(),
    healthController: new HealthController(healthService),
    scenarioController: new ScenarioController(scenarioService),
    systemController: new SystemController(systemService),
    teamController: new TeamController(teamService),
    ticketController: new TicketController(ticketService),
  }
}
