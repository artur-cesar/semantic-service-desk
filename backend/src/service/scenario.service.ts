import type { Scenario } from '../domain/scenario.domain.js'
import type { ScenarioRepository } from '../repository/scenario.repository.js'

export class ScenarioService {
  constructor(private readonly repository: ScenarioRepository) {}

  getScenario(): Promise<Scenario> {
    return this.repository.getScenario()
  }
}
