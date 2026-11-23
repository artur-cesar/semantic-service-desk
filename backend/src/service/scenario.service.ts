import type { Scenario } from '../domain/scenario.domain.js'
import type { ScenarioRepository } from '../repository/scenario.repository.js'

export interface ScenarioService {
  getScenario(): Promise<Scenario>
}

export function createScenarioService(
  repository: ScenarioRepository,
): ScenarioService {
  async function getScenario(): Promise<Scenario> {
    return repository.getScenario()
  }

  return {
    getScenario,
  }
}
