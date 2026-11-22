import type { FastifyReply, FastifyRequest } from 'fastify'

import type { HealthResponse } from '../responses/health.response.js'

export type HealthController = ReturnType<typeof createHealthController>

export function createHealthController() {
  function check(
    _request: FastifyRequest,
    reply: FastifyReply,
  ): HealthResponse {
    reply.code(200)

    return {
      status: 'ok',
    }
  }

  return {
    check,
  }
}
