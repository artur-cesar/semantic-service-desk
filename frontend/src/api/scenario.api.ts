import { getJson } from './api-client.js'

export interface ScenarioResponse {
  actors: {
    authorizedSystems: { code: string; id: string; name: string }[]
    capabilities: { code: string; id: string; name: string }[]
    department: { code: string; id: string; name: string }
    email: null | string
    id: string
    name: string
    teams: { code: string; id: string; name: string }[]
    type: 'AI_AGENT' | 'HUMAN' | 'SERVICE'
  }[]
  capabilities: {
    code: string
    description: null | string
    id: string
    name: string
  }[]
  categories: {
    code: string
    description: null | string
    id: string
    name: string
    parentId: null | string
  }[]
  departments: {
    code: string
    description: null | string
    id: string
    name: string
  }[]
  systems: {
    actions: {
      code: string
      description: null | string
      id: string
      name: string
    }[]
    code: string
    description: null | string
    id: string
    name: string
  }[]
  teams: {
    code: string
    department: { code: string; id: string; name: string }
    description: null | string
    id: string
    name: string
  }[]
}

export function getScenario(): Promise<ScenarioResponse> {
  return getJson<ScenarioResponse>('/scenario')
}
