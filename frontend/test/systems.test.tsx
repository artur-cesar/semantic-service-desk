import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { afterEach, expect, test, vi } from 'vitest'

import { SystemProfilePage } from '../src/pages/system-profile.page.js'
import { SystemsPage } from '../src/pages/systems.page.js'

const system = {
  actions: [
    {
      code: 'APPROVE_PURCHASE_ORDER',
      description: 'Approves a purchase order.',
      id: 'action',
      name: 'Approve purchase order',
    },
  ],
  authorizedActors: [
    {
      actor: {
        active: true,
        email: 'carla@example.com',
        id: 'carla',
        name: 'Carla',
        type: 'HUMAN',
      },
      createdAt: '2026-01-01T00:00:00.000Z',
      grantedAt: '2026-01-01T00:00:00.000Z',
      id: 'authorization',
      isCurrent: true,
      revokedAt: null,
    },
  ],
  code: 'ERP',
  description: 'Enterprise resource planning.',
  id: 'system',
  name: 'ERP',
}

const systems = {
  systems: [
    {
      actionsCount: 1,
      authorizedActorsCount: 1,
      code: system.code,
      description: system.description,
      id: system.id,
      name: system.name,
    },
  ],
}

afterEach(() => {
  vi.unstubAllGlobals()
})

test('opens a system profile by clicking its row', async () => {
  mockSystems()
  renderPage('/systems')

  fireEvent.click(
    await screen.findByRole('link', { name: "View ERP's profile" }),
  )

  expect(
    await screen.findByRole('heading', { name: 'ERP' }),
  ).toBeInTheDocument()
  expect(screen.getByText('Carla')).toBeInTheDocument()
})

test('describes a system, its actions, and authorized actors', async () => {
  mockSystems()
  renderPage('/system/system/profile')

  expect(
    await screen.findByRole('heading', { name: 'ERP' }),
  ).toBeInTheDocument()
  expect(screen.getByText('Approve purchase order')).toBeInTheDocument()
  expect(screen.getByRole('link', { name: 'Carla' })).toHaveAttribute(
    'href',
    '/actor/carla/profile',
  )
  expect(screen.getByText('Jan 1, 2026')).toBeInTheDocument()
})

function mockSystems() {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockImplementation((input: string) =>
      Promise.resolve(
        new Response(
          JSON.stringify(input.endsWith('/systems') ? systems : system),
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
          <Route element={<SystemsPage />} path="/systems" />
          <Route element={<SystemProfilePage />} path="/system/:id/profile" />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}
