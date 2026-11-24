import type { FastifyReply, FastifyRequest } from 'fastify'

import type { HealthResponse } from '../responses/health.response.js'
import type { HealthService } from '../service/health.service.js'

export class HealthController {
  constructor(private readonly service: HealthService) {}

  check = async (
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<HealthResponse> => {
    try {
      await this.service.checkDatabase()

      reply.code(200)

      return {
        database: 'reachable',
        status: 'ok',
      }
    } catch (error) {
      request.log.error({ err: error }, 'Database health check failed')
      reply.code(503)

      return {
        database: 'unreachable',
        status: 'error',
      }
    }
  }
}
