export interface BusinessActionProperties {
  active: boolean
  code: string
  createdAt: Date
  description: null | string
  id: string
  name: string
  systemId: string
  updatedAt: Date
}

export class BusinessAction {
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
  get systemId() {
    return this.properties.systemId
  }
  get updatedAt() {
    return this.properties.updatedAt
  }
  private constructor(private readonly properties: BusinessActionProperties) {}
  static create(properties: BusinessActionProperties): BusinessAction {
    return new BusinessAction(properties)
  }
}
