import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { afterEach, expect, test, vi } from 'vitest'

import { ActorProfilePage } from '../src/pages/actor-profile.page.js'
import { ActorsPage } from '../src/pages/actors.page.js'

const actor = {
  active: true,
  authorizations: [
    {
      createdAt: '2026-01-01T00:00:00.000Z',
      grantedAt: '2026-01-01T00:00:00.000Z',
      id: 'authorization',
      revokedAt: null,
      system: {
        code: 'ERP',
        description: 'Enterprise resource planning.',
        id: 'system',
        name: 'ERP',
      },
    },
  ],
  capabilities: [
    {
      capability: {
        code: 'ERP_ACCESS_MANAGEMENT',
        description: 'Manages ERP access requests.',
        id: 'capability',
        name: 'ERP Access Management',
      },
      createdAt: '2026-01-01T00:00:00.000Z',
      grantedAt: '2026-01-01T00:00:00.000Z',
      id: 'grant',
      revokedAt: null,
    },
  ],
  createdAt: '2026-01-01T00:00:00.000Z',
  department: {
    code: 'IT',
    description: 'Information technology.',
    id: 'department',
    name: 'Information Technology',
  },
  email: 'carla@example.com',
  id: 'carla',
  memberships: [
    {
      createdAt: '2026-01-01T00:00:00.000Z',
      endedAt: null,
      id: 'membership',
      startedAt: '2026-01-01T00:00:00.000Z',
      team: {
        code: 'ERP_SUPPORT',
        description: 'Supports the ERP platform.',
        id: 'team',
        name: 'ERP Support',
      },
    },
  ],
  name: 'Carla',
  type: 'HUMAN',
  updatedAt: '2026-01-01T00:00:00.000Z',
}

const actors = {
  actors: [
    {
      capabilitiesCount: 1,
      department: {
        code: 'IT',
        description: 'Information technology.',
        id: 'department',
        name: 'Information Technology',
      },
      email: 'carla@example.com',
      id: 'carla',
      name: 'Carla',
      teams: [
        {
          code: 'ERP_SUPPORT',
          description: 'Supports the ERP platform.',
          id: 'team',
          name: 'ERP Support',
        },
      ],
      type: 'HUMAN',
    },
  ],
}

afterEach(() => {
  vi.unstubAllGlobals()
})

test('opens an actor profile by clicking its row', async () => {
  mockScenario()

  renderPage('/actors')

  fireEvent.click(
    await screen.findByRole('link', { name: "View Carla's profile" }),
  )

  expect(
    await screen.findByRole('heading', { name: 'Carla' }),
  ).toBeInTheDocument()
})

test('describes an actor profile', async () => {
  mockScenario()

  renderPage('/actor/carla/profile')

  expect(
    await screen.findByRole('heading', { name: 'Carla' }),
  ).toBeInTheDocument()
  expect(screen.getByText('ERP Access Management')).toBeInTheDocument()
  expect(screen.getByText('Manages ERP access requests.')).toBeInTheDocument()
  expect(screen.getByText('ERP Support')).toBeInTheDocument()
  expect(screen.getByText('ERP', { selector: '.badge' })).toBeInTheDocument()
})

function mockScenario() {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockImplementation((input: string) =>
      Promise.resolve(
        new Response(
          JSON.stringify(input.endsWith('/actors') ? actors : actor),
          {
            headers: { 'Content-Type': 'application/json' },
            status: 200,
          },
        ),
      ),
    ),
  )
}

function renderPage(route: string) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route element={<ActorsPage />} path="/actors" />
          <Route element={<ActorProfilePage />} path="/actor/:id/profile" />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}
