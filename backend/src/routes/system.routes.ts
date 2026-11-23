import type { FastifyPluginCallback } from 'fastify'

import type { SystemController } from '../controller/system.controller.js'

import {
  systemDetailsRouteSchema,
  systemsRouteSchema,
} from '../responses/system.response.js'

interface SystemRoutesOptions {
  controller: SystemController
}

export const systemRoutes: FastifyPluginCallback<SystemRoutesOptions> = (
  app,
  { controller },
  done,
) => {
  app.get('/systems', { schema: systemsRouteSchema }, controller.list)
  app.get(
    '/systems/:id',
    { schema: systemDetailsRouteSchema },
    controller.findById,
  )

  done()
}
