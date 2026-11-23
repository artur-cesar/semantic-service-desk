import assert from 'node:assert/strict'
import { test } from 'node:test'

import type { SystemRepository } from '../src/repository/system.repository.js'
import type {
  SystemDetailsResponse,
  SystemsResponse,
} from '../src/responses/system.response.js'

import { buildApp } from '../src/app.js'
import { BusinessSystem } from '../src/domain/business-system.domain.js'
import { SystemAuthorizedActor } from '../src/domain/system-authorized-actor.domain.js'
import { SystemDetails } from '../src/domain/system-details.domain.js'
import { createTestDependencies } from './support/test-dependencies.js'

const now = new Date('2026-01-01T00:00:00.000Z')
const details = SystemDetails.create({
  authorizedActors: [
    SystemAuthorizedActor.create({
      actorActive: true,
      actorEmail: 'carla@example.com',
      actorId: '10000000-0000-4000-8000-000000000001',
      actorName: 'Carla',
      actorType: 'HUMAN',
      createdAt: now,
      grantedAt: now,
      id: '40000000-0000-4000-8000-000000000001',
      revokedAt: null,
    }),
  ],
  system: BusinessSystem.create({
    actions: [],
    active: true,
    code: 'ERP',
    createdAt: now,
    description: 'Enterprise resource planning',
    id: '30000000-0000-4000-8000-000000000001',
    name: 'ERP',
    updatedAt: now,
  }),
})

void test('GET /systems returns system summaries', async (context) => {
  const repository: SystemRepository = {
    findById: () => Promise.resolve(null),
    list: () => Promise.resolve([details]),
  }
  const app = await buildApp({
    dependencies: createTestDependencies({ systemRepository: repository }),
  })
  context.after(() => app.close())

  const response = await app.inject({ method: 'GET', url: '/systems' })

  assert.equal(response.statusCode, 200)
  assert.equal(
    response.json<SystemsResponse>().systems[0]?.authorizedActorsCount,
    1,
  )
})

void test('GET /systems/:id returns actions and authorizations', async (context) => {
  const repository: SystemRepository = {
    findById: () => Promise.resolve(details),
    list: () => Promise.resolve([]),
  }
  const app = await buildApp({
    dependencies: createTestDependencies({ systemRepository: repository }),
  })
  context.after(() => app.close())

  const response = await app.inject({
    method: 'GET',
    url: `/systems/${details.system.id}`,
  })

  assert.equal(response.statusCode, 200)
  assert.equal(
    response.json<SystemDetailsResponse>().authorizedActors[0]?.actor.name,
    'Carla',
  )
})

void test('GET /systems/:id returns 404 for an unknown system', async (context) => {
  const app = await buildApp({ dependencies: createTestDependencies() })
  context.after(() => app.close())

  const response = await app.inject({
    method: 'GET',
    url: '/systems/30000000-0000-4000-8000-000000000099',
  })

  assert.equal(response.statusCode, 404)
  assert.deepEqual(response.json(), { message: 'System not found' })
})
