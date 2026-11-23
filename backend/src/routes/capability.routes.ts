import type { FastifyPluginCallback } from 'fastify'

import type { CapabilityController } from '../controller/capability.controller.js'

import {
  capabilitiesRouteSchema,
  capabilityDetailsRouteSchema,
} from '../responses/capability.response.js'

interface CapabilityRoutesOptions {
  controller: CapabilityController
}

export const capabilityRoutes: FastifyPluginCallback<
  CapabilityRoutesOptions
> = (app, { controller }, done) => {
  app.get('/capabilities', { schema: capabilitiesRouteSchema }, controller.list)
  app.get(
    '/capabilities/:id',
    { schema: capabilityDetailsRouteSchema },
    controller.findById,
  )

  done()
}
