import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router'

import { getCapabilities } from '../api/capabilities.api.js'

export function CapabilitiesPage() {
  const navigate = useNavigate()
  const capabilities = useQuery({
    queryFn: getCapabilities,
    queryKey: ['capabilities'],
  })

  if (capabilities.isPending) {
    return (
      <div className="d-flex justify-content-center py-5" role="status">
        <div className="spinner-border text-primary" />
        <span className="visually-hidden">Loading capabilities</span>
      </div>
    )
  }

  if (capabilities.isError) {
    return (
      <div className="alert alert-danger" role="alert">
        <i className="bi bi-exclamation-triangle-fill me-2" />
        Unable to load capabilities. Make sure the API is running.
      </div>
    )
  }

  return (
    <div className="vstack gap-4">
      <header className="d-flex align-items-center gap-3">
        <div className="page-icon">
          <i aria-hidden="true" className="bi bi-stars" />
        </div>
        <div>
          <h1 className="h3 mb-1">Capabilities</h1>
          <p className="text-secondary mb-0">
            Skills used to evaluate whether an actor can handle a ticket.
          </p>
        </div>
      </header>

      {capabilities.data.capabilities.length === 0 ? (
        <div className="alert alert-info mb-0" role="status">
          <i className="bi bi-info-circle me-2" />
          No capabilities are available.
        </div>
      ) : (
        <section className="card border-0 shadow-sm">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-4" scope="col">
                    Capability
                  </th>
                  <th scope="col">Code</th>
                  <th className="pe-4" scope="col">
                    Actors
                  </th>
                </tr>
              </thead>
              <tbody>
                {capabilities.data.capabilities.map((capability) => (
                  <tr
                    aria-label={`View ${capability.name}'s profile`}
                    className="clickable-row"
                    key={capability.id}
                    onClick={() =>
                      void navigate(`/capability/${capability.id}/profile`)
                    }
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        void navigate(`/capability/${capability.id}/profile`)
                      }
                    }}
                    role="link"
                    tabIndex={0}
                  >
                    <td className="ps-4">
                      <div className="fw-semibold">{capability.name}</div>
                      <div className="small text-secondary">
                        {capability.description ?? 'No description'}
                      </div>
                    </td>
                    <td>
                      <code>{capability.code}</code>
                    </td>
                    <td className="pe-4">
                      <span className="badge text-bg-primary">
                        {capability.actorsCount}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  )
}
