import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { afterEach, expect, test, vi } from 'vitest'

import { CreateTicketPage } from '../src/pages/create-ticket.page.js'

const requesterId = '10000000-0000-4000-8000-000000000001'
const ticketId = '90000000-0000-4000-8000-000000000001'

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

const ticketResponse = {
  affectedSystemId: null,
  assigneeId: null,
  categoryId: null,
  closedAt: null,
  createdAt: '2026-01-01T00:00:00.000Z',
  description: 'I changed departments and can no longer approve purchases.',
  dueAt: null,
  id: ticketId,
  number: 1,
  previousDepartmentId: null,
  priority: 'MEDIUM',
  requestedActionId: null,
  requesterDepartmentId: null,
  requesterId,
  resolutionSummary: null,
  resolvedAt: null,
  source: 'API',
  status: 'DRAFT',
  teamId: null,
  title: 'Cannot approve purchases',
  updatedAt: '2026-01-01T00:00:00.000Z',
  version: 1,
}

afterEach(() => {
  vi.unstubAllGlobals()
})

test('creates a ticket from the natural-language request', async () => {
  const fetchMock = vi
    .fn()
    .mockImplementation((input: string, init?: RequestInit) =>
      Promise.resolve(
        new Response(
          JSON.stringify(
            init?.method === 'POST' ? ticketResponse : actorsResponse,
          ),
          {
            headers: { 'Content-Type': 'application/json' },
            status: init?.method === 'POST' ? 201 : 200,
          },
        ),
      ),
    )
  vi.stubGlobal('fetch', fetchMock)
  renderPage()

  await screen.findByRole('option', { name: 'João — Purchasing' })
  const createButton = screen.getByRole('button', { name: 'Create ticket' })

  expect(createButton).toBeDisabled()

  fireEvent.change(screen.getByLabelText(/^Requester/), {
    target: { value: requesterId },
  })
  fireEvent.change(screen.getByLabelText(/^Title/), {
    target: { value: ticketResponse.title },
  })
  fireEvent.change(screen.getByLabelText(/^Request in natural language/), {
    target: { value: ticketResponse.description },
  })

  expect(createButton).toBeEnabled()

  const form = createButton.closest('form')

  if (!form) {
    throw new Error('Ticket form was not rendered')
  }

  fireEvent.submit(form)

  expect(await screen.findByText('Ticket created')).toBeInTheDocument()
  expect(screen.getByText('#1')).toBeInTheDocument()
  expect(screen.getByLabelText(/^Requester/)).toHaveValue('')
  expect(screen.getByLabelText(/^Title/)).toHaveValue('')
  expect(screen.getByLabelText(/^Request in natural language/)).toHaveValue('')
  expect(createButton).toBeDisabled()
  expect(fetchMock).toHaveBeenLastCalledWith(
    '/api/tickets',
    expect.objectContaining({
      body: JSON.stringify({
        description: ticketResponse.description,
        priority: 'MEDIUM',
        requesterId,
        title: ticketResponse.title,
      }),
      method: 'POST',
    }),
  )
})

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      mutations: { retry: false },
      queries: { retry: false },
    },
  })

  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <CreateTicketPage />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}
