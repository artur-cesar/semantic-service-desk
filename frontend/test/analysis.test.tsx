import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { afterEach, expect, test, vi } from 'vitest'

import { AnalysisPage } from '../src/pages/analysis.page.js'

const requesterId = '10000000-0000-4000-8000-000000000001'

const actorsResponse = {
  actors: [
    {
      capabilitiesCount: 0,
      department: {
        code: 'PURCHASING',
        description: null,
        id: '20000000-0000-4000-8000-000000000001',
        name: 'Purchasing',
      },
      email: 'joao@example.com',
      id: requesterId,
      name: 'João',
      teams: [],
      type: 'HUMAN',
    },
  ],
}

const ticketsResponse = {
  pagination: {
    hasNextPage: true,
    hasPreviousPage: false,
    page: 1,
    pageSize: 10,
    totalItems: 11,
    totalPages: 2,
  },
  tickets: [
    {
      affectedSystemId: null,
      assigneeId: null,
      categoryId: null,
      closedAt: null,
      createdAt: '2026-11-24T12:00:00.000Z',
      description: 'I cannot create purchase orders.',
      dueAt: null,
      id: '90000000-0000-4000-8000-000000000001',
      number: 12,
      previousDepartmentId: null,
      priority: 'MEDIUM',
      requestedActionId: null,
      requesterDepartmentId: null,
      requesterId,
      resolutionSummary: null,
      resolvedAt: null,
      source: 'API',
      status: 'OPEN',
      teamId: null,
      title: 'Problem creating purchase orders',
      updatedAt: '2026-11-24T12:00:00.000Z',
      version: 1,
    },
  ],
}

afterEach(() => {
  vi.unstubAllGlobals()
})

test('lists recent tickets awaiting analysis', async () => {
  const fetchMock = vi.fn().mockImplementation((input: string) =>
    Promise.resolve(
      new Response(
        JSON.stringify(
          input.endsWith('/actors') ? actorsResponse : ticketsResponse,
        ),
        {
          headers: { 'Content-Type': 'application/json' },
          status: 200,
        },
      ),
    ),
  )
  vi.stubGlobal('fetch', fetchMock)
  renderPage()

  expect(
    await screen.findByRole('heading', { name: 'Ticket analysis' }),
  ).toBeInTheDocument()
  expect(
    screen.getByText('Problem creating purchase orders'),
  ).toBeInTheDocument()
  expect(await screen.findByText('João')).toBeInTheDocument()
  expect(screen.getByText('Not analyzed')).toBeInTheDocument()
  expect(screen.getByText('Showing 1–10 of 11 tickets')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Analyze' })).toBeDisabled()
  expect(fetchMock).toHaveBeenCalledWith(
    '/api/tickets?createdAtOrder=desc&page=1&pageSize=10',
    expect.anything(),
  )

  fireEvent.change(screen.getByLabelText('Created date'), {
    target: { value: 'asc' },
  })

  await waitFor(() => {
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/tickets?createdAtOrder=asc&page=1&pageSize=10',
      expect.anything(),
    )
  })
})

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <AnalysisPage />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}
