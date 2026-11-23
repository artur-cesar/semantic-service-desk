import type { AppPrismaClient } from '../../src/database/prisma.js'

import { seedIds } from './seed-ids.js'

interface CurrentActorRelation {
  actorId: string
  id: string
}

interface CurrentAuthorization extends CurrentActorRelation {
  systemId: string
}

interface CurrentCapability extends CurrentActorRelation {
  capabilityId: string
}

interface CurrentMembership extends CurrentActorRelation {
  teamId: string
}

export async function seedDemoScenario(prisma: AppPrismaClient) {
  const [carla, diego, erpSupport, platformOperations] = await Promise.all([
    prisma.actor.findUniqueOrThrow({ where: { email: 'carla@example.com' } }),
    prisma.actor.findUniqueOrThrow({ where: { email: 'diego@example.com' } }),
    prisma.team.findUniqueOrThrow({ where: { code: 'ERP_SUPPORT' } }),
    prisma.team.findUniqueOrThrow({ where: { code: 'PLATFORM_OPERATIONS' } }),
  ])

  await ensureCurrentMembership(prisma, {
    actorId: carla.id,
    id: seedIds.memberships.carlaErpSupport,
    teamId: erpSupport.id,
  })
  await ensureCurrentMembership(prisma, {
    actorId: diego.id,
    id: seedIds.memberships.diegoPlatformOperations,
    teamId: platformOperations.id,
  })

  const [erpAccess, identityManagement, platformOperationsCapability] =
    await Promise.all([
      prisma.capability.findUniqueOrThrow({
        where: { code: 'ERP_ACCESS_MANAGEMENT' },
      }),
      prisma.capability.findUniqueOrThrow({
        where: { code: 'IDENTITY_MANAGEMENT' },
      }),
      prisma.capability.findUniqueOrThrow({
        where: { code: 'PLATFORM_OPERATIONS' },
      }),
    ])

  await ensureCurrentCapability(prisma, {
    actorId: carla.id,
    capabilityId: erpAccess.id,
    id: seedIds.capabilityGrants.carlaErpAccess,
  })
  await ensureCurrentCapability(prisma, {
    actorId: carla.id,
    capabilityId: identityManagement.id,
    id: seedIds.capabilityGrants.carlaIdentity,
  })
  await ensureCurrentCapability(prisma, {
    actorId: diego.id,
    capabilityId: platformOperationsCapability.id,
    id: seedIds.capabilityGrants.diegoPlatform,
  })

  const erp = await prisma.businessSystem.findUniqueOrThrow({
    where: { code: 'ERP' },
  })

  await ensureCurrentAuthorization(prisma, {
    actorId: carla.id,
    id: seedIds.authorizations.carlaErp,
    systemId: erp.id,
  })
  await ensureCurrentAuthorization(prisma, {
    actorId: diego.id,
    id: seedIds.authorizations.diegoErp,
    systemId: erp.id,
  })
}

async function ensureCurrentAuthorization(
  prisma: AppPrismaClient,
  authorization: CurrentAuthorization,
) {
  const current = await prisma.actorSystemAuthorization.findFirst({
    where: {
      actorId: authorization.actorId,
      revokedAt: null,
      systemId: authorization.systemId,
    },
  })

  if (current) {
    return current
  }

  return prisma.actorSystemAuthorization.create({
    data: authorization,
  })
}

async function ensureCurrentCapability(
  prisma: AppPrismaClient,
  capability: CurrentCapability,
) {
  const current = await prisma.actorCapability.findFirst({
    where: {
      actorId: capability.actorId,
      capabilityId: capability.capabilityId,
      revokedAt: null,
    },
  })

  if (current) {
    return current
  }

  return prisma.actorCapability.create({
    data: capability,
  })
}

async function ensureCurrentMembership(
  prisma: AppPrismaClient,
  membership: CurrentMembership,
) {
  const current = await prisma.teamMembership.findFirst({
    where: {
      actorId: membership.actorId,
      endedAt: null,
      teamId: membership.teamId,
    },
  })

  if (current) {
    return current
  }

  return prisma.teamMembership.create({
    data: membership,
  })
}
