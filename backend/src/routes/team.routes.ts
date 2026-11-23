import type { FastifyPluginCallback } from 'fastify'

import type { TeamController } from '../controller/team.controller.js'

import {
  teamDetailsRouteSchema,
  teamsRouteSchema,
} from '../responses/team.response.js'

interface TeamRoutesOptions {
  controller: TeamController
}

export const teamRoutes: FastifyPluginCallback<TeamRoutesOptions> = (
  app,
  { controller },
  done,
) => {
  app.get('/teams', { schema: teamsRouteSchema }, controller.list)
  app.get('/teams/:id', { schema: teamDetailsRouteSchema }, controller.findById)

  done()
}
