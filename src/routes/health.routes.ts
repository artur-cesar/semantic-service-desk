import type { FastifyPluginCallback } from 'fastify'

import type { HealthController } from '../controller/health.controller.js'

import { healthRouteSchema } from '../responses/health.response.js'

interface HealthRoutesOptions {
  controller: HealthController
}

export const healthRoutes: FastifyPluginCallback<HealthRoutesOptions> = (
  app,
  { controller },
  done,
) => {
  app.get('/health', { schema: healthRouteSchema }, controller.check)

  done()
}
