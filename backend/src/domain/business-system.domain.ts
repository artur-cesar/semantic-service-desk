import type { BusinessAction } from './business-action.domain.js'

export interface BusinessSystemProperties {
  actions: BusinessAction[]
  active: boolean
  code: string
  createdAt: Date
  description: null | string
  id: string
  name: string
  updatedAt: Date
}

export class BusinessSystem {
  get actions() {
    return this.properties.actions
  }

  get active() {
    return this.properties.active
  }

  get code() {
    return this.properties.code
  }
  get createdAt() {
    return this.properties.createdAt
  }
  get description() {
    return this.properties.description
  }
  get id() {
    return this.properties.id
  }
  get name() {
    return this.properties.name
  }
  get updatedAt() {
    return this.properties.updatedAt
  }
  private constructor(private readonly properties: BusinessSystemProperties) {}
  static create(properties: BusinessSystemProperties): BusinessSystem {
    return new BusinessSystem(properties)
  }
}
