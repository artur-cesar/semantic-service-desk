import type { ScenarioResponse } from '../responses/scenario.response.js'
import type { ScenarioService } from '../service/scenario.service.js'

export class ScenarioController {
  constructor(private readonly service: ScenarioService) {}

  getScenario = async (): Promise<ScenarioResponse> => {
    const scenario = await this.service.getScenario()

    return {
      actors: scenario.actors.map((actor) => ({
        authorizedSystems: actor.authorizations.map(({ system }) => ({
          code: system.code,
          id: system.id,
          name: system.name,
        })),
        capabilities: actor.capabilities.map(({ capability }) => ({
          code: capability.code,
          id: capability.id,
          name: capability.name,
        })),
        department: {
          code: actor.department.code,
          id: actor.department.id,
          name: actor.department.name,
        },
        email: actor.email,
        id: actor.id,
        name: actor.name,
        teams: actor.memberships.map(({ team }) => ({
          code: team.code,
          id: team.id,
          name: team.name,
        })),
        type: actor.type,
      })),
      capabilities: scenario.capabilities.map((capability) => ({
        code: capability.code,
        description: capability.description,
        id: capability.id,
        name: capability.name,
      })),
      categories: scenario.categories.map((category) => ({
        code: category.code,
        description: category.description,
        id: category.id,
        name: category.name,
        parentId: category.parentId,
      })),
      departments: scenario.departments.map((department) => ({
        code: department.code,
        description: department.description,
        id: department.id,
        name: department.name,
      })),
      systems: scenario.systems.map((system) => ({
        actions: system.actions.map((action) => ({
          code: action.code,
          description: action.description,
          id: action.id,
          name: action.name,
        })),
        code: system.code,
        description: system.description,
        id: system.id,
        name: system.name,
      })),
      teams: scenario.teams.map((team) => ({
        code: team.code,
        department: {
          code: team.department.code,
          id: team.department.id,
          name: team.department.name,
        },
        description: team.description,
        id: team.id,
        name: team.name,
      })),
    }
  }
}
