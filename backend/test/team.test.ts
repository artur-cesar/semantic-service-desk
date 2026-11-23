import assert from 'node:assert/strict'
import { test } from 'node:test'

import type { TeamRepository } from '../src/repository/team.repository.js'
import type { TeamDetailsResponse } from '../src/responses/team.response.js'

import { buildApp } from '../src/app.js'
import { Department } from '../src/domain/department.domain.js'
import { TeamDetails } from '../src/domain/team-details.domain.js'
import { TeamMember } from '../src/domain/team-member.domain.js'
import { Team } from '../src/domain/team.domain.js'
import { createTestDependencies } from './support/test-dependencies.js'

void test('GET /teams returns active teams with their departments', async (context) => {
  const now = new Date('2026-01-01T00:00:00.000Z')
  const department = Department.create({
    active: true,
    code: 'IT',
    createdAt: now,
    description: 'Information technology',
    id: '20000000-0000-4000-8000-000000000001',
    name: 'Information Technology',
    updatedAt: now,
  })
  const team = Team.create({
    active: true,
    code: 'ERP_SUPPORT',
    createdAt: now,
    department,
    description: 'Supports the ERP platform',
    id: '30000000-0000-4000-8000-000000000001',
    name: 'ERP Support',
    updatedAt: now,
  })
  const member = TeamMember.create({
    actorActive: true,
    actorEmail: 'carla@example.com',
    actorId: '10000000-0000-4000-8000-000000000001',
    actorName: 'Carla',
    actorType: 'HUMAN',
    createdAt: now,
    endedAt: null,
    id: '40000000-0000-4000-8000-000000000001',
    startedAt: now,
  })
  const details = TeamDetails.create({ members: [member], team })
  const repository: TeamRepository = {
    findById: () => Promise.resolve(details),
    list: () => Promise.resolve([details]),
  }
  const app = await buildApp({
    dependencies: createTestDependencies({ teamRepository: repository }),
  })
  context.after(() => app.close())

  const response = await app.inject({ method: 'GET', url: '/teams' })

  assert.equal(response.statusCode, 200)
  assert.deepEqual(response.json(), {
    teams: [
      {
        code: 'ERP_SUPPORT',
        department: {
          code: 'IT',
          description: 'Information technology',
          id: '20000000-0000-4000-8000-000000000001',
          name: 'Information Technology',
        },
        description: 'Supports the ERP platform',
        id: '30000000-0000-4000-8000-000000000001',
        membersCount: 1,
        name: 'ERP Support',
      },
    ],
  })
})

void test('GET /teams/:id returns membership details', async (context) => {
  const now = new Date('2026-01-01T00:00:00.000Z')
  const team = Team.create({
    active: true,
    code: 'ERP_SUPPORT',
    createdAt: now,
    department: Department.create({
      active: true,
      code: 'IT',
      createdAt: now,
      description: null,
      id: '20000000-0000-4000-8000-000000000001',
      name: 'Information Technology',
      updatedAt: now,
    }),
    description: null,
    id: '30000000-0000-4000-8000-000000000001',
    name: 'ERP Support',
    updatedAt: now,
  })
  const details = TeamDetails.create({
    members: [
      TeamMember.create({
        actorActive: true,
        actorEmail: 'carla@example.com',
        actorId: '10000000-0000-4000-8000-000000000001',
        actorName: 'Carla',
        actorType: 'HUMAN',
        createdAt: now,
        endedAt: null,
        id: '40000000-0000-4000-8000-000000000001',
        startedAt: now,
      }),
    ],
    team,
  })
  const repository: TeamRepository = {
    findById: () => Promise.resolve(details),
    list: () => Promise.resolve([]),
  }
  const app = await buildApp({
    dependencies: createTestDependencies({ teamRepository: repository }),
  })
  context.after(() => app.close())

  const response = await app.inject({
    method: 'GET',
    url: `/teams/${team.id}`,
  })

  assert.equal(response.statusCode, 200)
  const responseBody = response.json<TeamDetailsResponse>()
  assert.equal(responseBody.members[0]?.actor.name, 'Carla')
  assert.equal(responseBody.members[0]?.isCurrent, true)
})

void test('GET /teams/:id returns 404 for an unknown team', async (context) => {
  const app = await buildApp({ dependencies: createTestDependencies() })
  context.after(() => app.close())

  const response = await app.inject({
    method: 'GET',
    url: '/teams/30000000-0000-4000-8000-000000000099',
  })

  assert.equal(response.statusCode, 404)
  assert.deepEqual(response.json(), { message: 'Team not found' })
})
