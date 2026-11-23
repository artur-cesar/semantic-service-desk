import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { afterEach, expect, test, vi } from 'vitest'

import { TeamProfilePage } from '../src/pages/team-profile.page.js'
import { TeamsPage } from '../src/pages/teams.page.js'

const team = {
  code: 'ERP_SUPPORT',
  department: {
    code: 'IT',
    description: 'Information technology.',
    id: 'department',
    name: 'Information Technology',
  },
  description: 'Supports the ERP platform.',
  id: 'team',
  members: [
    {
      actor: {
        active: true,
        email: 'carla@example.com',
        id: 'carla',
        name: 'Carla',
        type: 'HUMAN',
      },
      createdAt: '2026-01-01T00:00:00.000Z',
      endedAt: null,
      id: 'membership',
      isCurrent: true,
      startedAt: '2026-01-01T00:00:00.000Z',
    },
  ],
  name: 'ERP Support',
}

const teams = {
  teams: [
    {
      code: team.code,
      department: team.department,
      description: team.description,
      id: team.id,
      membersCount: 1,
      name: team.name,
    },
  ],
}

afterEach(() => {
  vi.unstubAllGlobals()
})

test('opens a team profile by clicking its row', async () => {
  mockTeams()
  renderPage('/teams')

  fireEvent.click(
    await screen.findByRole('link', { name: "View ERP Support's profile" }),
  )

  expect(
    await screen.findByRole('heading', { name: 'ERP Support' }),
  ).toBeInTheDocument()
  expect(screen.getByText('Carla')).toBeInTheDocument()
})

test('describes a team and its current members', async () => {
  mockTeams()
  renderPage('/team/team/profile')

  expect(
    await screen.findByRole('heading', { name: 'ERP Support' }),
  ).toBeInTheDocument()
  expect(screen.getByText('Information Technology')).toBeInTheDocument()
  expect(screen.getByRole('link', { name: 'Carla' })).toHaveAttribute(
    'href',
    '/actor/carla/profile',
  )
  expect(screen.getByText('Jan 1, 2026')).toBeInTheDocument()
})

function mockTeams() {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockImplementation((input: string) =>
      Promise.resolve(
        new Response(JSON.stringify(input.endsWith('/teams') ? teams : team), {
          headers: { 'Content-Type': 'application/json' },
          status: 200,
        }),
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
          <Route element={<TeamsPage />} path="/teams" />
          <Route element={<TeamProfilePage />} path="/team/:id/profile" />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}
