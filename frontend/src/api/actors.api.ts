import { getJson } from './api-client.js'

export interface ActorResponse {
  active: boolean
  authorizations: {
    createdAt: string
    grantedAt: string
    id: string
    revokedAt: null | string
    system: ActorResource
  }[]
  capabilities: {
    capability: ActorResource
    createdAt: string
    grantedAt: string
    id: string
    revokedAt: null | string
  }[]
  createdAt: string
  department: ActorResource
  email: null | string
  id: string
  memberships: {
    createdAt: string
    endedAt: null | string
    id: string
    startedAt: string
    team: ActorResource
  }[]
  name: string
  type: 'AI_AGENT' | 'HUMAN' | 'SERVICE'
  updatedAt: string
}

export interface ActorsResponse {
  actors: {
    capabilitiesCount: number
    department: ActorResource
    email: null | string
    id: string
    name: string
    teams: ActorResource[]
    type: 'AI_AGENT' | 'HUMAN' | 'SERVICE'
  }[]
}

interface ActorResource {
  code: string
  description: null | string
  id: string
  name: string
}

export function getActor(id: string): Promise<ActorResponse> {
  return getJson<ActorResponse>(`/actors/${id}`)
}

export function getActors(): Promise<ActorsResponse> {
  return getJson<ActorsResponse>('/actors')
}
