import type { FastifyReply, FastifyRequest } from 'fastify'

import type {
  ActorIdParameters,
  ActorNotFoundResponse,
  ActorResponse,
  ActorsResponse,
} from '../responses/actor.response.js'
import type { ActorService } from '../service/actor.service.js'

import { Actor } from '../domain/actor.domain.js'

export class ActorController {
  constructor(private readonly service: ActorService) {}

  findById = async (
    request: FastifyRequest<{ Params: ActorIdParameters }>,
    reply: FastifyReply,
  ): Promise<ActorNotFoundResponse | ActorResponse> => {
    const actor = await this.service.findById(request.params.id)

    if (!actor) {
      return reply.code(404).send({ message: 'Actor not found' })
    }

    return toActorResponse(actor)
  }

  list = async (): Promise<ActorsResponse> => {
    const actors = await this.service.list()

    return {
      actors: actors.map((actor) => ({
        capabilitiesCount: actor.capabilities.filter(
          ({ isCurrent }) => isCurrent,
        ).length,
        department: toResource(actor.department),
        email: actor.email,
        id: actor.id,
        name: actor.name,
        teams: actor.memberships
          .filter(({ isCurrent }) => isCurrent)
          .map(({ team }) => toResource(team)),
        type: actor.type,
      })),
    }
  }
}

function toActorResponse(actor: Actor): ActorResponse {
  return {
    active: actor.active,
    authorizations: actor.authorizations.map((authorization) => ({
      createdAt: authorization.createdAt.toISOString(),
      grantedAt: authorization.grantedAt.toISOString(),
      id: authorization.id,
      revokedAt: authorization.revokedAt?.toISOString() ?? null,
      system: toResource(authorization.system),
    })),
    capabilities: actor.capabilities.map((grant) => ({
      capability: toResource(grant.capability),
      createdAt: grant.createdAt.toISOString(),
      grantedAt: grant.grantedAt.toISOString(),
      id: grant.id,
      revokedAt: grant.revokedAt?.toISOString() ?? null,
    })),
    createdAt: actor.createdAt.toISOString(),
    department: toResource(actor.department),
    email: actor.email,
    id: actor.id,
    memberships: actor.memberships.map((membership) => ({
      createdAt: membership.createdAt.toISOString(),
      endedAt: membership.endedAt?.toISOString() ?? null,
      id: membership.id,
      startedAt: membership.startedAt.toISOString(),
      team: toResource(membership.team),
    })),
    name: actor.name,
    type: actor.type,
    updatedAt: actor.updatedAt.toISOString(),
  }
}

function toResource(resource: {
  code: string
  description: null | string
  id: string
  name: string
}) {
  return {
    code: resource.code,
    description: resource.description,
    id: resource.id,
    name: resource.name,
  }
}
