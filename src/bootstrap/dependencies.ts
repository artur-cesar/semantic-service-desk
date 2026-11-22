import { createHealthController } from '../controller/health.controller.js'

export type Dependencies = ReturnType<typeof createDependencies>

export function createDependencies() {
  const healthController = createHealthController()

  return {
    healthController,
  }
}
