import assert from 'node:assert/strict'
import { test } from 'node:test'

import type { ActorRepository } from '../src/repository/actor.repository.js'
import type { ActorResponse } from '../src/responses/actor.response.js'

import { buildApp } from '../src/app.js'
import { Actor } from '../src/domain/actor.domain.js'
import { Department } from '../src/domain/department.domain.js'
import { createTestDependencies } from './support/test-dependencies.js'

const now = new Date('2026-01-01T00:00:00.000Z')
const actor = Actor.create({
  active: true,
  authorizations: [],
  capabilities: [],
  createdAt: now,
  department: Department.create({
    active: true,
    code: 'IT',
    createdAt: now,
    description: 'Information technology',
    id: '20000000-0000-4000-8000-000000000001',
    name: 'Information Technology',
    updatedAt: now,
  }),
  email: 'carla@example.com',
  id: '10000000-0000-4000-8000-000000000001',
  memberships: [],
  name: 'Carla',
  type: 'HUMAN',
  updatedAt: now,
})

void test('GET /actors returns actor summaries', async (context) => {
  const repository: ActorRepository = {
    findById: () => Promise.resolve(null),
    list: () => Promise.resolve([actor]),
  }
  const app = await buildApp({
    dependencies: createTestDependencies({ actorRepository: repository }),
  })
  context.after(() => app.close())

  const response = await app.inject({ method: 'GET', url: '/actors' })

  assert.equal(response.statusCode, 200)
  assert.deepEqual(response.json(), {
    actors: [
      {
        capabilitiesCount: 0,
        department: {
          code: 'IT',
          description: 'Information technology',
          id: '20000000-0000-4000-8000-000000000001',
          name: 'Information Technology',
        },
        email: 'carla@example.com',
        id: '10000000-0000-4000-8000-000000000001',
        name: 'Carla',
        teams: [],
        type: 'HUMAN',
      },
    ],
  })
})

void test('GET /actors/:id returns an actor profile', async (context) => {
  const repository: ActorRepository = {
    findById: () => Promise.resolve(actor),
    list: () => Promise.resolve([]),
  }
  const app = await buildApp({
    dependencies: createTestDependencies({ actorRepository: repository }),
  })
  context.after(() => app.close())

  const response = await app.inject({
    method: 'GET',
    url: `/actors/${actor.id}`,
  })

  assert.equal(response.statusCode, 200)
  const responseBody = response.json<ActorResponse>()
  assert.equal(responseBody.name, 'Carla')
  assert.deepEqual(responseBody.capabilities, [])
})

void test('GET /actors/:id returns 404 for an unknown actor', async (context) => {
  const app = await buildApp({ dependencies: createTestDependencies() })
  context.after(() => app.close())

  const response = await app.inject({
    method: 'GET',
    url: '/actors/10000000-0000-4000-8000-000000000099',
  })

  assert.equal(response.statusCode, 404)
  assert.deepEqual(response.json(), { message: 'Actor not found' })
})
