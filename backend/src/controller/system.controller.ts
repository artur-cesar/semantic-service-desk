import type { FastifyReply, FastifyRequest } from 'fastify'

import type {
  SystemDetailsResponse,
  SystemIdParameters,
  SystemNotFoundResponse,
  SystemsResponse,
} from '../responses/system.response.js'
import type { SystemService } from '../service/system.service.js'

export type SystemController = ReturnType<typeof createSystemController>

export function createSystemController(service: SystemService) {
  async function findById(
    request: FastifyRequest<{ Params: SystemIdParameters }>,
    reply: FastifyReply,
  ): Promise<SystemDetailsResponse | SystemNotFoundResponse> {
    const details = await service.findById(request.params.id)

    if (!details) {
      return reply.code(404).send({ message: 'System not found' })
    }

    const { system } = details

    return {
      actions: system.actions.map((action) => ({
        code: action.code,
        description: action.description,
        id: action.id,
        name: action.name,
      })),
      authorizedActors: details.authorizedActors.map((authorization) => ({
        actor: {
          active: authorization.actorActive,
          email: authorization.actorEmail,
          id: authorization.actorId,
          name: authorization.actorName,
          type: authorization.actorType,
        },
        createdAt: authorization.createdAt.toISOString(),
        grantedAt: authorization.grantedAt.toISOString(),
        id: authorization.id,
        isCurrent: authorization.isCurrent,
        revokedAt: authorization.revokedAt?.toISOString() ?? null,
      })),
      code: system.code,
      description: system.description,
      id: system.id,
      name: system.name,
    }
  }

  async function list(): Promise<SystemsResponse> {
    const systemDetails = await service.list()

    return {
      systems: systemDetails.map(({ authorizedActors, system }) => ({
        actionsCount: system.actions.filter(({ active }) => active).length,
        authorizedActorsCount: authorizedActors.filter(
          ({ isCurrent }) => isCurrent,
        ).length,
        code: system.code,
        description: system.description,
        id: system.id,
        name: system.name,
      })),
    }
  }

  return { findById, list }
}
