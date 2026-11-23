import assert from 'node:assert/strict'
import { test } from 'node:test'

import type { CapabilityRepository } from '../src/repository/capability.repository.js'
import type {
  CapabilitiesResponse,
  CapabilityDetailsResponse,
} from '../src/responses/capability.response.js'

import { buildApp } from '../src/app.js'
import { CapabilityActor } from '../src/domain/capability-actor.domain.js'
import { CapabilityDetails } from '../src/domain/capability-details.domain.js'
import { Capability } from '../src/domain/capability.domain.js'
import { createTestDependencies } from './support/test-dependencies.js'

const now = new Date('2026-01-01T00:00:00.000Z')
const details = CapabilityDetails.create({
  actors: [
    CapabilityActor.create({
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
  capability: Capability.create({
    active: true,
    code: 'ERP_ACCESS_MANAGEMENT',
    createdAt: now,
    description: 'Manages access to the ERP',
    id: '30000000-0000-4000-8000-000000000001',
    name: 'ERP Access Management',
    updatedAt: now,
  }),
})

void test('GET /capabilities returns capability summaries', async (context) => {
  const repository: CapabilityRepository = {
    findById: () => Promise.resolve(null),
    list: () => Promise.resolve([details]),
  }
  const app = await buildApp({
    dependencies: createTestDependencies({ capabilityRepository: repository }),
  })
  context.after(() => app.close())

  const response = await app.inject({ method: 'GET', url: '/capabilities' })

  assert.equal(response.statusCode, 200)
  assert.equal(
    response.json<CapabilitiesResponse>().capabilities[0]?.actorsCount,
    1,
  )
})

void test('GET /capabilities/:id returns actors with the capability', async (context) => {
  const repository: CapabilityRepository = {
    findById: () => Promise.resolve(details),
    list: () => Promise.resolve([]),
  }
  const app = await buildApp({
    dependencies: createTestDependencies({ capabilityRepository: repository }),
  })
  context.after(() => app.close())

  const response = await app.inject({
    method: 'GET',
    url: `/capabilities/${details.capability.id}`,
  })

  assert.equal(response.statusCode, 200)
  assert.equal(
    response.json<CapabilityDetailsResponse>().actors[0]?.actor.name,
    'Carla',
  )
})

void test('GET /capabilities/:id returns 404 when unknown', async (context) => {
  const app = await buildApp({ dependencies: createTestDependencies() })
  context.after(() => app.close())

  const response = await app.inject({
    method: 'GET',
    url: '/capabilities/30000000-0000-4000-8000-000000000099',
  })

  assert.equal(response.statusCode, 404)
  assert.deepEqual(response.json(), { message: 'Capability not found' })
})
