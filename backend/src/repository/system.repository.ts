import type { AppPrismaClient } from '../database/prisma.js'
import type { Prisma } from '../generated/prisma/client.js'

import { BusinessAction } from '../domain/business-action.domain.js'
import { BusinessSystem } from '../domain/business-system.domain.js'
import { SystemAuthorizedActor } from '../domain/system-authorized-actor.domain.js'
import { SystemDetails } from '../domain/system-details.domain.js'

export interface SystemRepository {
  findById(id: string): Promise<null | SystemDetails>
  list(): Promise<SystemDetails[]>
}

const systemInclude = {
  actions: { orderBy: { code: 'asc' } },
  authorizations: {
    include: { actor: true },
    orderBy: { grantedAt: 'desc' },
  },
} satisfies Prisma.BusinessSystemInclude

type SystemRecord = Prisma.BusinessSystemGetPayload<{
  include: typeof systemInclude
}>

export class PrismaSystemRepository implements SystemRepository {
  constructor(private readonly prisma: AppPrismaClient) {}

  async findById(id: string): Promise<null | SystemDetails> {
    const record = await this.prisma.businessSystem.findFirst({
      include: systemInclude,
      where: { active: true, id },
    })

    return record ? toDomain(record) : null
  }

  async list(): Promise<SystemDetails[]> {
    const records = await this.prisma.businessSystem.findMany({
      include: systemInclude,
      orderBy: { name: 'asc' },
      where: { active: true },
    })

    return records.map(toDomain)
  }
}

function toDomain(record: SystemRecord): SystemDetails {
  return SystemDetails.create({
    authorizedActors: record.authorizations.map((authorization) =>
      SystemAuthorizedActor.create({
        actorActive: authorization.actor.active,
        actorEmail: authorization.actor.email,
        actorId: authorization.actor.id,
        actorName: authorization.actor.name,
        actorType: authorization.actor.type,
        createdAt: authorization.createdAt,
        grantedAt: authorization.grantedAt,
        id: authorization.id,
        revokedAt: authorization.revokedAt,
      }),
    ),
    system: BusinessSystem.create({
      actions: record.actions.map((action) => BusinessAction.create(action)),
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
