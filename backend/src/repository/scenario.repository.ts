import type { AppPrismaClient } from '../database/prisma.js'

import { ActorCapability } from '../domain/actor-capability.domain.js'
import { ActorSystemAuthorization } from '../domain/actor-system-authorization.domain.js'
import { Actor } from '../domain/actor.domain.js'
import { BusinessAction } from '../domain/business-action.domain.js'
import { BusinessSystem } from '../domain/business-system.domain.js'
import { Capability } from '../domain/capability.domain.js'
import { Department } from '../domain/department.domain.js'
import { Scenario } from '../domain/scenario.domain.js'
import { TeamMembership } from '../domain/team-membership.domain.js'
import { Team } from '../domain/team.domain.js'
import { TicketCategory } from '../domain/ticket-category.domain.js'

export interface ScenarioRepository {
  getScenario(): Promise<Scenario>
}

export function createScenarioRepository(
  prisma: AppPrismaClient,
): ScenarioRepository {
  async function getScenario(): Promise<Scenario> {
    const [
      departmentRecords,
      capabilityRecords,
      systemRecords,
      teamRecords,
      categoryRecords,
      actorRecords,
    ] = await Promise.all([
      prisma.department.findMany({
        orderBy: { code: 'asc' },
        where: { active: true },
      }),
      prisma.capability.findMany({
        orderBy: { code: 'asc' },
        where: { active: true },
      }),
      prisma.businessSystem.findMany({
        include: {
          actions: {
            orderBy: { code: 'asc' },
            where: { active: true },
          },
        },
        orderBy: { code: 'asc' },
        where: { active: true },
      }),
      prisma.team.findMany({
        orderBy: { code: 'asc' },
        where: {
          active: true,
          department: { active: true },
        },
      }),
      prisma.ticketCategory.findMany({
        orderBy: { code: 'asc' },
        where: { active: true },
      }),
      prisma.actor.findMany({
        include: {
          authorizations: {
            orderBy: { system: { code: 'asc' } },
            where: {
              revokedAt: null,
              system: { active: true },
            },
          },
          capabilities: {
            orderBy: { capability: { code: 'asc' } },
            where: {
              capability: { active: true },
              revokedAt: null,
            },
          },
          memberships: {
            orderBy: { team: { code: 'asc' } },
            where: {
              endedAt: null,
              team: { active: true },
            },
          },
        },
        orderBy: { name: 'asc' },
        where: {
          active: true,
          department: { active: true },
        },
      }),
    ])

    const departments = departmentRecords.map((record) =>
      Department.create(record),
    )
    const departmentsById = new Map(
      departments.map((department) => [department.id, department]),
    )

    const capabilities = capabilityRecords.map((record) =>
      Capability.create(record),
    )
    const capabilitiesById = new Map(
      capabilities.map((capability) => [capability.id, capability]),
    )

    const systems = systemRecords.map((record) =>
      BusinessSystem.create({
        actions: record.actions.map((action) => BusinessAction.create(action)),
        active: record.active,
        code: record.code,
        createdAt: record.createdAt,
        description: record.description,
        id: record.id,
        name: record.name,
        updatedAt: record.updatedAt,
      }),
    )
    const systemsById = new Map(systems.map((system) => [system.id, system]))

    const teams = teamRecords.map((record) =>
      Team.create({
        active: record.active,
        code: record.code,
        createdAt: record.createdAt,
        department: getRequired(
          departmentsById,
          record.departmentId,
          'department',
        ),
        description: record.description,
        id: record.id,
        name: record.name,
        updatedAt: record.updatedAt,
      }),
    )
    const teamsById = new Map(teams.map((team) => [team.id, team]))

    const categories = categoryRecords.map((record) =>
      TicketCategory.create(record),
    )

    const actors = actorRecords.map((record) =>
      Actor.create({
        active: record.active,
        authorizations: record.authorizations.map((authorization) =>
          ActorSystemAuthorization.create({
            createdAt: authorization.createdAt,
            grantedAt: authorization.grantedAt,
            id: authorization.id,
            revokedAt: authorization.revokedAt,
            system: getRequired(
              systemsById,
              authorization.systemId,
              'business system',
            ),
          }),
        ),
        capabilities: record.capabilities.map((grant) =>
          ActorCapability.create({
            capability: getRequired(
              capabilitiesById,
              grant.capabilityId,
              'capability',
            ),
            createdAt: grant.createdAt,
            grantedAt: grant.grantedAt,
            id: grant.id,
            revokedAt: grant.revokedAt,
          }),
        ),
        createdAt: record.createdAt,
        department: getRequired(
          departmentsById,
          record.departmentId,
          'department',
        ),
        email: record.email,
        id: record.id,
        memberships: record.memberships.map((membership) =>
          TeamMembership.create({
            createdAt: membership.createdAt,
            endedAt: membership.endedAt,
            id: membership.id,
            startedAt: membership.startedAt,
            team: getRequired(teamsById, membership.teamId, 'team'),
          }),
        ),
        name: record.name,
        type: record.type,
        updatedAt: record.updatedAt,
      }),
    )

    return Scenario.create({
      actors,
      capabilities,
      categories,
      departments,
      systems,
      teams,
    })
  }

  return {
    getScenario,
  }
}

function getRequired<T>(
  values: Map<string, T>,
  id: string,
  entityName: string,
): T {
  const value = values.get(id)

  if (!value) {
    throw new Error(`Scenario ${entityName} ${id} was not loaded`)
  }

  return value
}
