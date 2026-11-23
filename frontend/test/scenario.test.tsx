import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { afterEach, expect, test, vi } from 'vitest'

import { ScenarioPage } from '../src/pages/scenario.page.js'

afterEach(() => {
  vi.unstubAllGlobals()
})

test('renders actors returned by the scenario endpoint', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          actors: [
            {
              authorizedSystems: [{ id: 'system', name: 'ERP' }],
              capabilities: [
                { id: 'capability', name: 'ERP Access Management' },
              ],
              department: { name: 'Information Technology' },
              email: 'carla@example.com',
              id: 'carla',
              name: 'Carla',
              teams: [{ id: 'team', name: 'ERP Support' }],
              type: 'HUMAN',
            },
          ],
          capabilities: [],
          categories: [],
          departments: [],
          systems: [],
          teams: [],
        }),
        { status: 200 },
      ),
    ),
  )
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <ScenarioPage />
      </MemoryRouter>
    </QueryClientProvider>,
  )

  expect(await screen.findByText('Carla')).toBeInTheDocument()
  expect(screen.getByText('ERP Access Management')).toBeInTheDocument()
  expect(screen.getByRole('link', { name: 'Carla' })).toHaveAttribute(
    'href',
    '/actor/carla/profile',
  )
  expect(
    screen.getByRole('link', { name: 'ERP Access Management' }),
  ).toHaveAttribute('href', '/capability/capability/profile')
  expect(screen.getByRole('link', { name: 'ERP' })).toHaveAttribute(
    'href',
    '/system/system/profile',
  )
})
