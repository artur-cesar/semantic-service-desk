import { getJson } from './api-client.js'

export interface SystemDetailsResponse {
  actions: {
    code: string
    description: null | string
    id: string
    name: string
  }[]
  authorizedActors: {
    actor: {
      active: boolean
      email: null | string
      id: string
      name: string
      type: 'AI_AGENT' | 'HUMAN' | 'SERVICE'
    }
    createdAt: string
    grantedAt: string
    id: string
    isCurrent: boolean
    revokedAt: null | string
  }[]
  code: string
  description: null | string
  id: string
  name: string
}

export interface SystemsResponse {
  systems: {
    actionsCount: number
    authorizedActorsCount: number
    code: string
    description: null | string
    id: string
    name: string
  }[]
}

export function getSystem(id: string): Promise<SystemDetailsResponse> {
  return getJson<SystemDetailsResponse>(`/systems/${id}`)
}

export function getSystems(): Promise<SystemsResponse> {
  return getJson<SystemsResponse>('/systems')
}
