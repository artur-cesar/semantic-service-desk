import type { FastifyReply, FastifyRequest } from 'fastify'

import type { HealthResponse } from '../responses/health.response.js'
import type { HealthService } from '../service/health.service.js'

export type HealthController = ReturnType<typeof createHealthController>

export function createHealthController(service: HealthService) {
  async function check(
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<HealthResponse> {
    try {
      await service.checkDatabase()

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

  return {
    check,
  }
}
