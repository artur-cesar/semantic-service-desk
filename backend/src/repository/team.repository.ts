import type { AppPrismaClient } from '../database/prisma.js'
import type { Prisma } from '../generated/prisma/client.js'

import { Department } from '../domain/department.domain.js'
import { TeamDetails } from '../domain/team-details.domain.js'
import { TeamMember } from '../domain/team-member.domain.js'
import { Team } from '../domain/team.domain.js'

export interface TeamRepository {
  findById(id: string): Promise<null | TeamDetails>
  list(): Promise<TeamDetails[]>
}

const teamInclude = {
  department: true,
  memberships: {
    include: { actor: true },
    orderBy: { startedAt: 'desc' },
  },
} satisfies Prisma.TeamInclude

type TeamRecord = Prisma.TeamGetPayload<{ include: typeof teamInclude }>

export class PrismaTeamRepository implements TeamRepository {
  constructor(private readonly prisma: AppPrismaClient) {}

  async findById(id: string): Promise<null | TeamDetails> {
    const record = await this.prisma.team.findFirst({
      include: teamInclude,
      where: {
        active: true,
        department: { active: true },
        id,
      },
    })

    return record ? toDomain(record) : null
  }

  async list(): Promise<TeamDetails[]> {
    const records = await this.prisma.team.findMany({
      include: teamInclude,
      orderBy: { name: 'asc' },
      where: {
        active: true,
        department: { active: true },
      },
    })

    return records.map(toDomain)
  }
}

function toDomain(record: TeamRecord): TeamDetails {
  return TeamDetails.create({
    members: record.memberships.map((membership) =>
      TeamMember.create({
        actorActive: membership.actor.active,
        actorEmail: membership.actor.email,
        actorId: membership.actor.id,
        actorName: membership.actor.name,
        actorType: membership.actor.type,
        createdAt: membership.createdAt,
        endedAt: membership.endedAt,
        id: membership.id,
        startedAt: membership.startedAt,
      }),
    ),
    team: Team.create({
      active: record.active,
      code: record.code,
      createdAt: record.createdAt,
      department: Department.create(record.department),
      description: record.description,
      id: record.id,
      name: record.name,
      updatedAt: record.updatedAt,
    }),
  })
}
