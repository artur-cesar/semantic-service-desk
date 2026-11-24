import type { FastifyReply, FastifyRequest } from 'fastify'

import type {
  CapabilitiesResponse,
  CapabilityDetailsResponse,
  CapabilityIdParameters,
  CapabilityNotFoundResponse,
} from '../responses/capability.response.js'
import type { CapabilityService } from '../service/capability.service.js'

export class CapabilityController {
  constructor(private readonly service: CapabilityService) {}

  findById = async (
    request: FastifyRequest<{ Params: CapabilityIdParameters }>,
    reply: FastifyReply,
  ): Promise<CapabilityDetailsResponse | CapabilityNotFoundResponse> => {
    const details = await this.service.findById(request.params.id)

    if (!details) {
      return reply.code(404).send({ message: 'Capability not found' })
    }

    return {
      actors: details.actors.map((grant) => ({
        actor: {
          active: grant.actorActive,
          email: grant.actorEmail,
          id: grant.actorId,
          name: grant.actorName,
          type: grant.actorType,
        },
        createdAt: grant.createdAt.toISOString(),
        grantedAt: grant.grantedAt.toISOString(),
        id: grant.id,
        isCurrent: grant.isCurrent,
        revokedAt: grant.revokedAt?.toISOString() ?? null,
      })),
      code: details.capability.code,
      description: details.capability.description,
      id: details.capability.id,
      name: details.capability.name,
    }
  }

  list = async (): Promise<CapabilitiesResponse> => {
    const details = await this.service.list()

    return {
      capabilities: details.map(({ actors, capability }) => ({
        actorsCount: actors.filter(({ isCurrent }) => isCurrent).length,
        code: capability.code,
        description: capability.description,
        id: capability.id,
        name: capability.name,
      })),
    }
  }
}
