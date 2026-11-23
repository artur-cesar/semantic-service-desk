import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router'

import { getSystems } from '../api/systems.api.js'

export function SystemsPage() {
  const navigate = useNavigate()
  const systems = useQuery({
    queryFn: getSystems,
    queryKey: ['systems'],
  })

  if (systems.isPending) {
    return (
      <div className="d-flex justify-content-center py-5" role="status">
        <div className="spinner-border text-primary" />
        <span className="visually-hidden">Loading systems</span>
      </div>
    )
  }

  if (systems.isError) {
    return (
      <div className="alert alert-danger" role="alert">
        <i className="bi bi-exclamation-triangle-fill me-2" />
        Unable to load systems. Make sure the API is running.
      </div>
    )
  }

  return (
    <div className="vstack gap-4">
      <header className="d-flex align-items-center gap-3">
        <div className="page-icon">
          <i aria-hidden="true" className="bi bi-cpu-fill" />
        </div>
        <div>
          <h1 className="h3 mb-1">Systems</h1>
          <p className="text-secondary mb-0">
            Business systems, supported actions, and authorized actors.
          </p>
        </div>
      </header>

      {systems.data.systems.length === 0 ? (
        <div className="alert alert-info mb-0" role="status">
          <i className="bi bi-info-circle me-2" />
          No systems are available.
        </div>
      ) : (
        <section className="card border-0 shadow-sm">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-4" scope="col">
                    System
                  </th>
                  <th scope="col">Code</th>
                  <th scope="col">Actions</th>
                  <th className="pe-4" scope="col">
                    Authorized actors
                  </th>
                </tr>
              </thead>
              <tbody>
                {systems.data.systems.map((system) => (
                  <tr
                    aria-label={`View ${system.name}'s profile`}
                    className="clickable-row"
                    key={system.id}
                    onClick={() =>
                      void navigate(`/system/${system.id}/profile`)
                    }
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        void navigate(`/system/${system.id}/profile`)
                      }
                    }}
                    role="link"
                    tabIndex={0}
                  >
                    <td className="ps-4">
                      <div className="fw-semibold">{system.name}</div>
                      <div className="small text-secondary">
                        {system.description ?? 'No description'}
                      </div>
                    </td>
                    <td>
                      <code>{system.code}</code>
                    </td>
                    <td>{system.actionsCount}</td>
                    <td className="pe-4">
                      <span className="badge text-bg-success">
                        {system.authorizedActorsCount}
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
