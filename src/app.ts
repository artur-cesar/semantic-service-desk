import Fastify from 'fastify'

import {
  createDependencies,
  type Dependencies,
} from './bootstrap/dependencies.js'
import { loadEnvironment } from './config/environment.js'
import { healthRoutes } from './routes/health.routes.js'

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

  await app.register(healthRoutes, {
    controller: dependencies.healthController,
  })

  return app
}
