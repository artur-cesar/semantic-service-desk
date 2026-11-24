import type { Environment } from '../config/environment.js'

import { ActorController } from '../controller/actor.controller.js'
import { CapabilityController } from '../controller/capability.controller.js'
import { HealthController } from '../controller/health.controller.js'
import { ScenarioController } from '../controller/scenario.controller.js'
import { SystemController } from '../controller/system.controller.js'
import { TeamController } from '../controller/team.controller.js'
import { TicketController } from '../controller/ticket.controller.js'
import { createPrismaClient } from '../database/prisma.js'
import { PrismaActorRepository } from '../repository/actor.repository.js'
import { PrismaCapabilityRepository } from '../repository/capability.repository.js'
import { PrismaHealthRepository } from '../repository/health.repository.js'
import { PrismaScenarioRepository } from '../repository/scenario.repository.js'
import { PrismaSystemRepository } from '../repository/system.repository.js'
import { PrismaTeamRepository } from '../repository/team.repository.js'
import { PrismaTicketRepository } from '../repository/ticket.repository.js'
import { ActorService } from '../service/actor.service.js'
import { CapabilityService } from '../service/capability.service.js'
import { HealthService } from '../service/health.service.js'
import { ScenarioService } from '../service/scenario.service.js'
import { SystemService } from '../service/system.service.js'
import { TeamService } from '../service/team.service.js'
import { TicketService } from '../service/ticket.service.js'

export type Dependencies = ReturnType<typeof createDependencies>

export function createDependencies(environment: Environment) {
  const prisma = createPrismaClient(environment.databaseUrl)
  const healthRepository = new PrismaHealthRepository(prisma)
  const healthService = new HealthService(healthRepository)
  const healthController = new HealthController(healthService)

  //Scenarios
  const scenarioRepository = new PrismaScenarioRepository(prisma)
  const scenarioService = new ScenarioService(scenarioRepository)
  const scenarioController = new ScenarioController(scenarioService)

  //Systems
  const systemRepository = new PrismaSystemRepository(prisma)
  const systemService = new SystemService(systemRepository)
  const systemController = new SystemController(systemService)

  //Teams
  const teamRepository = new PrismaTeamRepository(prisma)
  const teamService = new TeamService(teamRepository)
  const teamController = new TeamController(teamService)

  //Actors
  const actorRepository = new PrismaActorRepository(prisma)
  const actorService = new ActorService(actorRepository)
  const actorController = new ActorController(actorService)

  //Capability
  const capabilityRepository = new PrismaCapabilityRepository(prisma)
  const capabilityService = new CapabilityService(capabilityRepository)
  const capabilityController = new CapabilityController(capabilityService)

  //Tickets
  const ticketRepository = new PrismaTicketRepository(prisma)
  const ticketService = new TicketService(ticketRepository, actorRepository)
  const ticketController = new TicketController(ticketService)

  async function dispose(): Promise<void> {
    await prisma.$disconnect()
  }

  return {
    actorController,
    capabilityController,
    dispose,
    healthController,
    scenarioController,
    systemController,
    teamController,
    ticketController,
  }
}
