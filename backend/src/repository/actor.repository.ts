import type { AppPrismaClient } from '../database/prisma.js'
import type { Prisma } from '../generated/prisma/client.js'

import { ActorCapability } from '../domain/actor-capability.domain.js'
import { ActorSystemAuthorization } from '../domain/actor-system-authorization.domain.js'
import { Actor } from '../domain/actor.domain.js'
import { BusinessAction } from '../domain/business-action.domain.js'
import { BusinessSystem } from '../domain/business-system.domain.js'
import { Capability } from '../domain/capability.domain.js'
import { Department } from '../domain/department.domain.js'
import { TeamMembership } from '../domain/team-membership.domain.js'
import { Team } from '../domain/team.domain.js'

const actorInclude = {
  authorizations: {
    include: {
      system: {
        include: { actions: { orderBy: { code: 'asc' } } },
      },
    },
    orderBy: { grantedAt: 'desc' },
  },
  capabilities: {
    include: { capability: true },
    orderBy: { grantedAt: 'desc' },
  },
  department: true,
  memberships: {
    include: { team: { include: { department: true } } },
    orderBy: { startedAt: 'desc' },
  },
} satisfies Prisma.ActorInclude

export interface ActorRepository {
  findById(id: string): Promise<Actor | null>
  list(): Promise<Actor[]>
}

type ActorRecord = Prisma.ActorGetPayload<{ include: typeof actorInclude }>

export function createActorRepository(
  prisma: AppPrismaClient,
): ActorRepository {
  async function findById(id: string): Promise<Actor | null> {
    const record = await prisma.actor.findFirst({
      include: actorInclude,
      where: { active: true, id },
    })

    return record ? toDomain(record) : null
  }

  async function list(): Promise<Actor[]> {
    const records = await prisma.actor.findMany({
      include: actorInclude,
      orderBy: { name: 'asc' },
      where: { active: true },
    })

    return records.map(toDomain)
  }

  return { findById, list }
}

function toDomain(record: ActorRecord): Actor {
  const department = Department.create(record.department)

  return Actor.create({
    active: record.active,
    authorizations: record.authorizations.map((authorization) =>
      ActorSystemAuthorization.create({
        createdAt: authorization.createdAt,
        grantedAt: authorization.grantedAt,
        id: authorization.id,
        revokedAt: authorization.revokedAt,
        system: BusinessSystem.create({
          actions: authorization.system.actions.map((action) =>
            BusinessAction.create(action),
          ),
          active: authorization.system.active,
          code: authorization.system.code,
          createdAt: authorization.system.createdAt,
          description: authorization.system.description,
          id: authorization.system.id,
          name: authorization.system.name,
          updatedAt: authorization.system.updatedAt,
        }),
      }),
    ),
    capabilities: record.capabilities.map((grant) =>
      ActorCapability.create({
        capability: Capability.create(grant.capability),
        createdAt: grant.createdAt,
        grantedAt: grant.grantedAt,
        id: grant.id,
        revokedAt: grant.revokedAt,
      }),
    ),
    createdAt: record.createdAt,
    department,
    email: record.email,
    id: record.id,
    memberships: record.memberships.map((membership) =>
      TeamMembership.create({
        createdAt: membership.createdAt,
        endedAt: membership.endedAt,
        id: membership.id,
        startedAt: membership.startedAt,
        team: Team.create({
          active: membership.team.active,
          code: membership.team.code,
          createdAt: membership.team.createdAt,
          department: Department.create(membership.team.department),
          description: membership.team.description,
          id: membership.team.id,
          name: membership.team.name,
          updatedAt: membership.team.updatedAt,
        }),
      }),
    ),
    name: record.name,
    type: record.type,
    updatedAt: record.updatedAt,
  })
}
