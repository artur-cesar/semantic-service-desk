import assert from 'node:assert/strict'
import { test } from 'node:test'

import type { HealthRepository } from '../src/repository/health.repository.js'

import { buildApp } from '../src/app.js'
import { createTestDependencies } from './support/test-dependencies.js'

void test('GET /health reports that the API is healthy', async (context) => {
  const repository: HealthRepository = {
    checkDatabase: () => Promise.resolve(),
  }
  const app = await buildApp({
    dependencies: createTestDependencies({ healthRepository: repository }),
  })

  context.after(async () => {
    await app.close()
  })

  const response = await app.inject({
    method: 'GET',
    url: '/health',
  })

  assert.equal(response.statusCode, 200)
  assert.deepEqual(response.json(), {
    database: 'reachable',
    status: 'ok',
  })
})

void test('GET /health reports an unavailable database', async (context) => {
  const repository: HealthRepository = {
    checkDatabase: () => Promise.reject(new Error('Database unavailable')),
  }
  const app = await buildApp({
    dependencies: createTestDependencies({ healthRepository: repository }),
  })

  context.after(async () => {
    await app.close()
  })

  const response = await app.inject({
    method: 'GET',
    url: '/health',
  })

  assert.equal(response.statusCode, 503)
  assert.deepEqual(response.json(), {
    database: 'unreachable',
    status: 'error',
  })
})
