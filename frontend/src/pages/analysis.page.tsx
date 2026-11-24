import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

import { getActors } from '../api/actors.api.js'
import { getTickets } from '../api/tickets.api.js'

const pageSize = 10

export function AnalysisPage() {
  const [createdAtOrder, setCreatedAtOrder] = useState<'asc' | 'desc'>('desc')
  const [page, setPage] = useState(1)
  const tickets = useQuery({
    queryFn: () => getTickets({ createdAtOrder, page, pageSize }),
    queryKey: ['tickets', { createdAtOrder, page, pageSize }],
  })
  const actors = useQuery({ queryFn: getActors, queryKey: ['actors'] })

  if (tickets.isPending) {
    return (
      <div className="d-flex justify-content-center py-5" role="status">
        <div className="spinner-border text-primary" />
        <span className="visually-hidden">Loading tickets</span>
      </div>
    )
  }

  if (tickets.isError) {
    return (
      <div className="alert alert-danger" role="alert">
        <i className="bi bi-exclamation-triangle-fill me-2" />
        Unable to load tickets. Make sure the API is running.
      </div>
    )
  }

  const actorNames = new Map(
    actors.data?.actors.map((actor) => [actor.id, actor.name]) ?? [],
  )
  const { pagination } = tickets.data
  const firstItem =
    pagination.totalItems === 0
      ? 0
      : (pagination.page - 1) * pagination.pageSize + 1
  const lastItem = Math.min(
    pagination.page * pagination.pageSize,
    pagination.totalItems,
  )

  return (
    <div className="vstack gap-4">
      <header className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
        <div className="d-flex align-items-center gap-3">
          <div className="page-icon">
            <i aria-hidden="true" className="bi bi-clipboard-data-fill" />
          </div>
          <div>
            <h1 className="h3 mb-1">Ticket analysis</h1>
            <p className="text-secondary mb-0">
              Inspect recent tickets and follow their analysis lifecycle.
            </p>
          </div>
        </div>

        <div>
          <label className="form-label small mb-1" htmlFor="ticket-order">
            Created date
          </label>
          <select
            className="form-select form-select-sm"
            id="ticket-order"
            onChange={(event) => {
              setCreatedAtOrder(event.target.value as 'asc' | 'desc')
              setPage(1)
            }}
            value={createdAtOrder}
          >
            <option value="desc">Newest first</option>
            <option value="asc">Oldest first</option>
          </select>
        </div>
      </header>

      {tickets.data.tickets.length === 0 ? (
        <div className="alert alert-info mb-0" role="status">
          <i className="bi bi-info-circle me-2" />
          No tickets are available for analysis.
        </div>
      ) : (
        <section className="card border-0 shadow-sm">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-4" scope="col">
                    Ticket
                  </th>
                  <th scope="col">Requester</th>
                  <th scope="col">Priority</th>
                  <th scope="col">Analysis</th>
                  <th scope="col">Created at</th>
                  <th className="pe-4 text-end" scope="col">
                    Next action
                  </th>
                </tr>
              </thead>
              <tbody>
                {tickets.data.tickets.map((ticket) => (
                  <tr key={ticket.id}>
                    <td className="ps-4">
                      <div className="fw-semibold">#{ticket.number}</div>
                      <div>{ticket.title}</div>
                    </td>
                    <td>
                      {actorNames.get(ticket.requesterId) ?? (
                        <span className="text-secondary">
                          Unknown requester
                        </span>
                      )}
                    </td>
                    <td>
                      <span
                        className={`badge ${priorityClass(ticket.priority)}`}
                      >
                        {formatLabel(ticket.priority)}
                      </span>
                    </td>
                    <td>
                      <span className="badge text-bg-light border">
                        Not analyzed
                      </span>
                    </td>
                    <td>{formatDate(ticket.createdAt)}</td>
                    <td className="pe-4 text-end">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        disabled
                        title="The analysis workflow is not available yet"
                        type="button"
                      >
                        Analyze
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="card-footer bg-white d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3 px-4 py-3">
            <span className="small text-secondary">
              Showing {firstItem}–{lastItem} of {pagination.totalItems} tickets
            </span>
            <nav aria-label="Ticket analysis pagination">
              <ul className="pagination pagination-sm mb-0">
                <li
                  className={`page-item${pagination.hasPreviousPage ? '' : ' disabled'}`}
                >
                  <button
                    aria-label="Previous page"
                    className="page-link"
                    disabled={!pagination.hasPreviousPage}
                    onClick={() => setPage((current) => current - 1)}
                    type="button"
                  >
                    Previous
                  </button>
                </li>
                <li className="page-item disabled">
                  <span className="page-link">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                </li>
                <li
                  className={`page-item${pagination.hasNextPage ? '' : ' disabled'}`}
                >
                  <button
                    aria-label="Next page"
                    className="page-link"
                    disabled={!pagination.hasNextPage}
                    onClick={() => setPage((current) => current + 1)}
                    type="button"
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </section>
      )}
    </div>
  )
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function formatLabel(value: string) {
  return value[0] + value.slice(1).toLowerCase().replaceAll('_', ' ')
}

function priorityClass(priority: string) {
  if (priority === 'CRITICAL') return 'text-bg-danger'
  if (priority === 'HIGH') return 'text-bg-warning'

  return 'text-bg-secondary'
}
