import { getJson } from './api-client.js'

export interface CapabilitiesResponse {
  capabilities: {
    actorsCount: number
    code: string
    description: null | string
    id: string
    name: string
  }[]
}

export interface CapabilityDetailsResponse {
  actors: {
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

export function getCapabilities(): Promise<CapabilitiesResponse> {
  return getJson<CapabilitiesResponse>('/capabilities')
}

export function getCapability(id: string): Promise<CapabilityDetailsResponse> {
  return getJson<CapabilityDetailsResponse>(`/capabilities/${id}`)
}
