import { getJson } from './api-client.js'

export interface TeamDetailsResponse {
  code: string
  department: {
    code: string
    description: null | string
    id: string
    name: string
  }
  description: null | string
  id: string
  members: {
    actor: {
      active: boolean
      email: null | string
      id: string
      name: string
      type: 'AI_AGENT' | 'HUMAN' | 'SERVICE'
    }
    createdAt: string
    endedAt: null | string
    id: string
    isCurrent: boolean
    startedAt: string
  }[]
  name: string
}

export interface TeamsResponse {
  teams: {
    code: string
    department: {
      code: string
      description: null | string
      id: string
      name: string
    }
    description: null | string
    id: string
    membersCount: number
    name: string
  }[]
}

export function getTeam(id: string): Promise<TeamDetailsResponse> {
  return getJson<TeamDetailsResponse>(`/teams/${id}`)
}

export function getTeams(): Promise<TeamsResponse> {
  return getJson<TeamsResponse>('/teams')
}
