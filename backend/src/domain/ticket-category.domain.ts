export interface TicketCategoryProperties {
  active: boolean
  code: string
  createdAt: Date
  description: null | string
  id: string
  name: string
  parentId: null | string
  updatedAt: Date
}

export class TicketCategory {
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
  get parentId() {
    return this.properties.parentId
  }
  get updatedAt() {
    return this.properties.updatedAt
  }
  private constructor(private readonly properties: TicketCategoryProperties) {}
  static create(properties: TicketCategoryProperties): TicketCategory {
    return new TicketCategory(properties)
  }
}
