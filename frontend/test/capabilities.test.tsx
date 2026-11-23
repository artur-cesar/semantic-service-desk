import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { afterEach, expect, test, vi } from 'vitest'

import { CapabilitiesPage } from '../src/pages/capabilities.page.js'
import { CapabilityProfilePage } from '../src/pages/capability-profile.page.js'

const capability = {
  actors: [
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
      id: 'grant',
      isCurrent: true,
      revokedAt: null,
    },
  ],
  code: 'ERP_ACCESS_MANAGEMENT',
  description: 'Manages access to the ERP.',
  id: 'capability',
  name: 'ERP Access Management',
}

const capabilities = {
  capabilities: [
    {
      actorsCount: 1,
      code: capability.code,
      description: capability.description,
      id: capability.id,
      name: capability.name,
    },
  ],
}

afterEach(() => {
  vi.unstubAllGlobals()
})

test('opens a capability profile by clicking its row', async () => {
  mockCapabilities()
  renderPage('/capabilities')

  fireEvent.click(
    await screen.findByRole('link', {
      name: "View ERP Access Management's profile",
    }),
  )

  expect(
    await screen.findByRole('heading', { name: 'ERP Access Management' }),
  ).toBeInTheDocument()
  expect(screen.getByText('Carla')).toBeInTheDocument()
})

test('describes a capability and its actors', async () => {
  mockCapabilities()
  renderPage('/capability/capability/profile')

  expect(
    await screen.findByRole('heading', { name: 'ERP Access Management' }),
  ).toBeInTheDocument()
  expect(screen.getByRole('link', { name: 'Carla' })).toHaveAttribute(
    'href',
    '/actor/carla/profile',
  )
  expect(screen.getByText('Jan 1, 2026')).toBeInTheDocument()
})

function mockCapabilities() {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockImplementation((input: string) =>
      Promise.resolve(
        new Response(
          JSON.stringify(
            input.endsWith('/capabilities') ? capabilities : capability,
          ),
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
          <Route element={<CapabilitiesPage />} path="/capabilities" />
          <Route
            element={<CapabilityProfilePage />}
            path="/capability/:id/profile"
          />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}
