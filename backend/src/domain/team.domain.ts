import type { Department } from './department.domain.js'

export interface TeamProperties {
  active: boolean
  code: string
  createdAt: Date
  department: Department
  description: null | string
  id: string
  name: string
  updatedAt: Date
}

export class Team {
  get active() {
    return this.properties.active
  }

  get code() {
    return this.properties.code
  }

  get createdAt() {
    return this.properties.createdAt
  }
  get department() {
    return this.properties.department
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
  private constructor(private readonly properties: TeamProperties) {}
  static create(properties: TeamProperties): Team {
    return new Team(properties)
  }
}
