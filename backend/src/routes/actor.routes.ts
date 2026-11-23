import type { FastifyPluginCallback } from 'fastify'

import type { ActorController } from '../controller/actor.controller.js'

import {
  actorRouteSchema,
  actorsRouteSchema,
} from '../responses/actor.response.js'

interface ActorRoutesOptions {
  controller: ActorController
}

export const actorRoutes: FastifyPluginCallback<ActorRoutesOptions> = (
  app,
  { controller },
  done,
) => {
  app.get('/actors', { schema: actorsRouteSchema }, controller.list)
  app.get('/actors/:id', { schema: actorRouteSchema }, controller.findById)

  done()
}
