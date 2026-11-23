import assert from 'node:assert/strict'
import { test } from 'node:test'

import type { ScenarioRepository } from '../src/repository/scenario.repository.js'

import { buildApp } from '../src/app.js'
import { Scenario } from '../src/domain/scenario.domain.js'
import { createTestDependencies } from './support/test-dependencies.js'

void test('GET /scenario returns the current exploration scenario', async (context) => {
  const repository: ScenarioRepository = {
    getScenario: () =>
      Promise.resolve(
        Scenario.create({
          actors: [],
          capabilities: [],
          categories: [],
          departments: [],
          systems: [],
          teams: [],
        }),
      ),
  }
  const app = await buildApp({
    dependencies: createTestDependencies({ scenarioRepository: repository }),
  })

  context.after(async () => {
    await app.close()
  })

  const response = await app.inject({
    method: 'GET',
    url: '/scenario',
  })

  assert.equal(response.statusCode, 200)
  assert.deepEqual(response.json(), {
    actors: [],
    capabilities: [],
    categories: [],
    departments: [],
    systems: [],
    teams: [],
  })
})
