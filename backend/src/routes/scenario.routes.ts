import type { FastifyPluginCallback } from 'fastify'

import type { ScenarioController } from '../controller/scenario.controller.js'

import { scenarioRouteSchema } from '../responses/scenario.response.js'

interface ScenarioRoutesOptions {
  controller: ScenarioController
}

export const scenarioRoutes: FastifyPluginCallback<ScenarioRoutesOptions> = (
  app,
  { controller },
  done,
) => {
  app.get('/scenario', { schema: scenarioRouteSchema }, controller.getScenario)

  done()
}
