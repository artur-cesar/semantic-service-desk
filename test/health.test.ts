import assert from 'node:assert/strict'
import { test } from 'node:test'

import { buildApp } from '../src/app.js'

void test('GET /health reports that the API is healthy', async (context) => {
  const app = await buildApp()

  context.after(async () => {
    await app.close()
  })

  const response = await app.inject({
    method: 'GET',
    url: '/health',
  })

  assert.equal(response.statusCode, 200)
  assert.deepEqual(response.json(), {
    status: 'ok',
  })
})
