import type { AppPrismaClient } from '../database/prisma.js'
import type { Prisma } from '../generated/prisma/client.js'

import { CapabilityActor } from '../domain/capability-actor.domain.js'
import { CapabilityDetails } from '../domain/capability-details.domain.js'
import { Capability } from '../domain/capability.domain.js'

export interface CapabilityRepository {
  findById(id: string): Promise<CapabilityDetails | null>
  list(): Promise<CapabilityDetails[]>
}

const capabilityInclude = {
  actors: {
    include: { actor: true },
    orderBy: { grantedAt: 'desc' },
  },
} satisfies Prisma.CapabilityInclude

type CapabilityRecord = Prisma.CapabilityGetPayload<{
  include: typeof capabilityInclude
}>

export function createCapabilityRepository(
  prisma: AppPrismaClient,
): CapabilityRepository {
  async function findById(id: string): Promise<CapabilityDetails | null> {
    const record = await prisma.capability.findFirst({
      include: capabilityInclude,
      where: { active: true, id },
    })

    return record ? toDomain(record) : null
  }

  async function list(): Promise<CapabilityDetails[]> {
    const records = await prisma.capability.findMany({
      include: capabilityInclude,
      orderBy: { name: 'asc' },
      where: { active: true },
    })

    return records.map(toDomain)
  }

  return { findById, list }
}

function toDomain(record: CapabilityRecord): CapabilityDetails {
  return CapabilityDetails.create({
    actors: record.actors.map((grant) =>
      CapabilityActor.create({
        actorActive: grant.actor.active,
        actorEmail: grant.actor.email,
        actorId: grant.actor.id,
        actorName: grant.actor.name,
        actorType: grant.actor.type,
        createdAt: grant.createdAt,
        grantedAt: grant.grantedAt,
        id: grant.id,
        revokedAt: grant.revokedAt,
      }),
    ),
    capability: Capability.create({
      active: record.active,
      code: record.code,
      createdAt: record.createdAt,
      description: record.description,
      id: record.id,
      name: record.name,
      updatedAt: record.updatedAt,
    }),
  })
}
