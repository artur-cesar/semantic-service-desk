import type { FastifyReply, FastifyRequest } from 'fastify'

import type {
  TeamDetailsResponse,
  TeamIdParameters,
  TeamNotFoundResponse,
  TeamsResponse,
} from '../responses/team.response.js'
import type { TeamService } from '../service/team.service.js'

export class TeamController {
  constructor(private readonly service: TeamService) {}

  findById = async (
    request: FastifyRequest<{ Params: TeamIdParameters }>,
    reply: FastifyReply,
  ): Promise<TeamDetailsResponse | TeamNotFoundResponse> => {
    const details = await this.service.findById(request.params.id)

    if (!details) {
      return reply.code(404).send({ message: 'Team not found' })
    }

    const { team } = details

    return {
      code: team.code,
      department: toDepartment(team.department),
      description: team.description,
      id: team.id,
      members: details.members.map((member) => ({
        actor: {
          active: member.actorActive,
          email: member.actorEmail,
          id: member.actorId,
          name: member.actorName,
          type: member.actorType,
        },
        createdAt: member.createdAt.toISOString(),
        endedAt: member.endedAt?.toISOString() ?? null,
        id: member.id,
        isCurrent: member.isCurrent,
        startedAt: member.startedAt.toISOString(),
      })),
      name: team.name,
    }
  }
  list = async (): Promise<TeamsResponse> => {
    const teamDetails = await this.service.list()

    return {
      teams: teamDetails.map(({ members, team }) => ({
        code: team.code,
        department: toDepartment(team.department),
        description: team.description,
        id: team.id,
        membersCount: members.filter(({ isCurrent }) => isCurrent).length,
        name: team.name,
      })),
    }
  }
}

function toDepartment(department: {
  code: string
  description: null | string
  id: string
  name: string
}) {
  return {
    code: department.code,
    description: department.description,
    id: department.id,
    name: department.name,
  }
}
