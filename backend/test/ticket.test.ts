import assert from 'node:assert/strict'
import { test } from 'node:test'

import type { ActorRepository } from '../src/repository/actor.repository.js'
import type {
  CreateTicketData,
  TicketRepository,
} from '../src/repository/ticket.repository.js'

import { buildApp } from '../src/app.js'
import { Actor } from '../src/domain/actor.domain.js'
import { Department } from '../src/domain/department.domain.js'
import { Ticket } from '../src/domain/ticket.domain.js'
import { createTestDependencies } from './support/test-dependencies.js'

const now = new Date('2026-01-01T00:00:00.000Z')
const requesterId = '10000000-0000-4000-8000-000000000001'
const ticketId = '90000000-0000-4000-8000-000000000001'

const ticket = Ticket.create({
  affectedSystemId: null,
  assigneeId: null,
  categoryId: null,
  closedAt: null,
  createdAt: now,
  description: 'I changed departments and can no longer approve purchases.',
  dueAt: null,
  id: ticketId,
  number: 1,
  previousDepartmentId: null,
  priority: 'MEDIUM',
  requestedActionId: null,
  requesterDepartmentId: null,
  requesterId,
  resolutionSummary: null,
  resolvedAt: null,
  source: 'API',
  status: 'DRAFT',
  teamId: null,
  title: 'Cannot approve purchases after department change',
  updatedAt: now,
  version: 1,
})

const confirmedTicket = Ticket.create({
  affectedSystemId: ticket.affectedSystemId,
  assigneeId: ticket.assigneeId,
  categoryId: ticket.categoryId,
  closedAt: ticket.closedAt,
  createdAt: ticket.createdAt,
  description: ticket.description,
  dueAt: ticket.dueAt,
  id: ticket.id,
  number: ticket.number,
  previousDepartmentId: ticket.previousDepartmentId,
  priority: ticket.priority,
  requestedActionId: ticket.requestedActionId,
  requesterDepartmentId: ticket.requesterDepartmentId,
  requesterId: ticket.requesterId,
  resolutionSummary: ticket.resolutionSummary,
  resolvedAt: ticket.resolvedAt,
  source: ticket.source,
  status: 'OPEN',
  teamId: ticket.teamId,
  title: ticket.title,
  updatedAt: ticket.updatedAt,
  version: 2,
})

const requester = Actor.create({
  active: true,
  authorizations: [],
  capabilities: [],
  createdAt: now,
  department: Department.create({
    active: true,
    code: 'PURCHASING',
    createdAt: now,
    description: null,
    id: '20000000-0000-4000-8000-000000000001',
    name: 'Purchasing',
    updatedAt: now,
  }),
  email: 'joao@example.com',
  id: requesterId,
  memberships: [],
  name: 'João',
  type: 'HUMAN',
  updatedAt: now,
})

const actorRepository: ActorRepository = {
  findById: (id) => Promise.resolve(id === requesterId ? requester : null),
  list: () => Promise.resolve([]),
}

void test('POST /tickets creates a draft ticket', async (context) => {
  let creationData: CreateTicketData | undefined
  const repository: TicketRepository = {
    confirm: () => Promise.resolve({ outcome: 'not_found' }),
    create: (data) => {
      creationData = data
      return Promise.resolve(ticket)
    },
    findById: () => Promise.resolve(null),
    list: () => Promise.resolve({ tickets: [], totalItems: 0 }),
  }
  const app = await buildApp({
    dependencies: createTestDependencies({
      actorRepository,
      ticketRepository: repository,
    }),
  })
  context.after(() => app.close())

  const response = await app.inject({
    method: 'POST',
    payload: {
      description: ticket.description,
      requesterId,
      title: ticket.title,
    },
    url: '/tickets',
  })

  assert.equal(response.statusCode, 201)
  assert.deepEqual(creationData, {
    description: ticket.description,
    priority: 'MEDIUM',
    requesterId,
    title: ticket.title,
  })
  assert.equal(response.json<{ id: string }>().id, ticketId)
  assert.equal(response.json<{ status: string }>().status, 'DRAFT')
})

void test('POST /tickets returns 404 for an unknown requester', async (context) => {
  const app = await buildApp({ dependencies: createTestDependencies() })
  context.after(() => app.close())

  const response = await app.inject({
    method: 'POST',
    payload: {
      description: ticket.description,
      requesterId,
      title: ticket.title,
    },
    url: '/tickets',
  })

  assert.equal(response.statusCode, 404)
  assert.deepEqual(response.json(), { message: 'Requester not found' })
})

void test('POST /tickets/:id/confirm opens a draft ticket', async (context) => {
  const repository: TicketRepository = {
    confirm: () =>
      Promise.resolve({ outcome: 'confirmed', ticket: confirmedTicket }),
    create: () => Promise.resolve(ticket),
    findById: () => Promise.resolve(null),
    list: () => Promise.resolve({ tickets: [], totalItems: 0 }),
  }
  const app = await buildApp({
    dependencies: createTestDependencies({ ticketRepository: repository }),
  })
  context.after(() => app.close())

  const response = await app.inject({
    method: 'POST',
    url: `/tickets/${ticketId}/confirm`,
  })

  assert.equal(response.statusCode, 200)
  assert.equal(response.json<{ status: string }>().status, 'OPEN')
  assert.equal(response.json<{ version: number }>().version, 2)
})

void test('POST /tickets/:id/confirm rejects a ticket that is not a draft', async (context) => {
  const repository: TicketRepository = {
    confirm: () => Promise.resolve({ outcome: 'not_draft' }),
    create: () => Promise.resolve(ticket),
    findById: () => Promise.resolve(null),
    list: () => Promise.resolve({ tickets: [], totalItems: 0 }),
  }
  const app = await buildApp({
    dependencies: createTestDependencies({ ticketRepository: repository }),
  })
  context.after(() => app.close())

  const response = await app.inject({
    method: 'POST',
    url: `/tickets/${ticketId}/confirm`,
  })

  assert.equal(response.statusCode, 409)
  assert.deepEqual(response.json(), {
    message: 'Only draft tickets can be confirmed',
  })
})

void test('POST /tickets/:id/confirm returns 404 for an unknown ticket', async (context) => {
  const app = await buildApp({ dependencies: createTestDependencies() })
  context.after(() => app.close())

  const response = await app.inject({
    method: 'POST',
    url: `/tickets/${ticketId}/confirm`,
  })

  assert.equal(response.statusCode, 404)
  assert.deepEqual(response.json(), { message: 'Ticket not found' })
})

void test('GET /tickets returns the most recent tickets by default', async (context) => {
  let listOptions: Parameters<TicketRepository['list']>[0] | undefined
  const repository: TicketRepository = {
    confirm: () => Promise.resolve({ outcome: 'not_found' }),
    create: () => Promise.resolve(ticket),
    findById: () => Promise.resolve(null),
    list: (options) => {
      listOptions = options
      return Promise.resolve({ tickets: [ticket], totalItems: 21 })
    },
  }
  const app = await buildApp({
    dependencies: createTestDependencies({ ticketRepository: repository }),
  })
  context.after(() => app.close())

  const response = await app.inject({ method: 'GET', url: '/tickets' })

  assert.equal(response.statusCode, 200)
  assert.deepEqual(listOptions, {
    createdAtOrder: 'desc',
    page: 1,
    pageSize: 20,
  })
  const responseBody = response.json<{
    pagination: {
      hasNextPage: boolean
      hasPreviousPage: boolean
      page: number
      pageSize: number
      totalItems: number
      totalPages: number
    }
    tickets: unknown[]
  }>()
  assert.deepEqual(responseBody.pagination, {
    hasNextPage: true,
    hasPreviousPage: false,
    page: 1,
    pageSize: 20,
    totalItems: 21,
    totalPages: 2,
  })
  assert.equal(responseBody.tickets.length, 1)
})

void test('GET /tickets accepts pagination and ascending date order', async (context) => {
  let listOptions: Parameters<TicketRepository['list']>[0] | undefined
  const repository: TicketRepository = {
    confirm: () => Promise.resolve({ outcome: 'not_found' }),
    create: () => Promise.resolve(ticket),
    findById: () => Promise.resolve(null),
    list: (options) => {
      listOptions = options
      return Promise.resolve({ tickets: [], totalItems: 45 })
    },
  }
  const app = await buildApp({
    dependencies: createTestDependencies({ ticketRepository: repository }),
  })
  context.after(() => app.close())

  const response = await app.inject({
    method: 'GET',
    url: '/tickets?page=2&pageSize=10&createdAtOrder=asc',
  })

  assert.equal(response.statusCode, 200)
  assert.deepEqual(listOptions, {
    createdAtOrder: 'asc',
    page: 2,
    pageSize: 10,
  })
  assert.deepEqual(response.json(), {
    pagination: {
      hasNextPage: true,
      hasPreviousPage: true,
      page: 2,
      pageSize: 10,
      totalItems: 45,
      totalPages: 5,
    },
    tickets: [],
  })
})

void test('GET /tickets/:id returns a ticket', async (context) => {
  const repository: TicketRepository = {
    confirm: () => Promise.resolve({ outcome: 'not_found' }),
    create: () => Promise.resolve(ticket),
    findById: (id) => Promise.resolve(id === ticketId ? ticket : null),
    list: () => Promise.resolve({ tickets: [], totalItems: 0 }),
  }
  const app = await buildApp({
    dependencies: createTestDependencies({ ticketRepository: repository }),
  })
  context.after(() => app.close())

  const response = await app.inject({
    method: 'GET',
    url: `/tickets/${ticketId}`,
  })

  assert.equal(response.statusCode, 200)
  assert.deepEqual(response.json(), {
    affectedSystemId: null,
    assigneeId: null,
    categoryId: null,
    closedAt: null,
    createdAt: now.toISOString(),
    description: ticket.description,
    dueAt: null,
    id: ticketId,
    number: 1,
    previousDepartmentId: null,
    priority: 'MEDIUM',
    requestedActionId: null,
    requesterDepartmentId: null,
    requesterId,
    resolutionSummary: null,
    resolvedAt: null,
    source: 'API',
    status: 'DRAFT',
    teamId: null,
    title: ticket.title,
    updatedAt: now.toISOString(),
    version: 1,
  })
})

void test('GET /tickets/:id returns 404 for an unknown ticket', async (context) => {
  const app = await buildApp({ dependencies: createTestDependencies() })
  context.after(() => app.close())

  const response = await app.inject({
    method: 'GET',
    url: `/tickets/${ticketId}`,
  })

  assert.equal(response.statusCode, 404)
  assert.deepEqual(response.json(), { message: 'Ticket not found' })
})
