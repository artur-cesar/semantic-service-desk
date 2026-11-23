import Fastify from 'fastify'

import {
  createDependencies,
  type Dependencies,
} from './bootstrap/dependencies.js'
import { loadEnvironment } from './config/environment.js'
import { actorRoutes } from './routes/actor.routes.js'
import { healthRoutes } from './routes/health.routes.js'
import { scenarioRoutes } from './routes/scenario.routes.js'
import { systemRoutes } from './routes/system.routes.js'
import { teamRoutes } from './routes/team.routes.js'

interface BuildAppOptions {
  dependencies?: Dependencies
  logger?: boolean
}

export async function buildApp(options: BuildAppOptions = {}) {
  const app = Fastify({
    logger: options.logger ?? false,
  })

  const dependencies =
    options.dependencies ?? createDependencies(loadEnvironment())

  app.addHook('onClose', async () => {
    await dependencies.dispose()
  })

  await app.register(actorRoutes, {
    controller: dependencies.actorController,
  })
  await app.register(healthRoutes, {
    controller: dependencies.healthController,
  })
  await app.register(scenarioRoutes, {
    controller: dependencies.scenarioController,
  })
  await app.register(systemRoutes, {
    controller: dependencies.systemController,
  })
  await app.register(teamRoutes, {
    controller: dependencies.teamController,
  })

  return app
}
