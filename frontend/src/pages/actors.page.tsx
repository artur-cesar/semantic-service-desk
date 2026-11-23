import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router'

import { getActors } from '../api/actors.api.js'

export function ActorsPage() {
  const navigate = useNavigate()
  const actors = useQuery({
    queryFn: getActors,
    queryKey: ['actors'],
  })

  if (actors.isPending) {
    return (
      <div className="d-flex justify-content-center py-5" role="status">
        <div className="spinner-border text-primary" />
        <span className="visually-hidden">Loading actors</span>
      </div>
    )
  }

  if (actors.isError) {
    return (
      <div className="alert alert-danger" role="alert">
        <i className="bi bi-exclamation-triangle-fill me-2" />
        Unable to load actors. Make sure the API is running.
      </div>
    )
  }

  return (
    <div className="vstack gap-4">
      <header className="d-flex align-items-center gap-3">
        <div className="page-icon">
          <i aria-hidden="true" className="bi bi-people-fill" />
        </div>
        <div>
          <h1 className="h3 mb-1">Actors</h1>
          <p className="text-secondary mb-0">
            People, services, and agents eligible to participate in ticket
            resolution.
          </p>
        </div>
      </header>

      {actors.data.actors.length === 0 ? (
        <div className="alert alert-info mb-0" role="status">
          <i className="bi bi-info-circle me-2" />
          No actors are available in this scenario.
        </div>
      ) : (
        <section className="card border-0 shadow-sm">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-4" scope="col">
                    Actor
                  </th>
                  <th scope="col">Type</th>
                  <th scope="col">Department</th>
                  <th scope="col">Teams</th>
                  <th className="pe-4" scope="col">
                    Capabilities
                  </th>
                </tr>
              </thead>
              <tbody>
                {actors.data.actors.map((actor) => (
                  <tr
                    aria-label={`View ${actor.name}'s profile`}
                    className="clickable-row"
                    key={actor.id}
                    onClick={() => void navigate(`/actor/${actor.id}/profile`)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        void navigate(`/actor/${actor.id}/profile`)
                      }
                    }}
                    role="link"
                    tabIndex={0}
                  >
                    <td className="ps-4">
                      <div className="fw-semibold">{actor.name}</div>
                      <div className="small text-secondary">
                        {actor.email ?? 'No email address'}
                      </div>
                    </td>
                    <td>
                      <span className="badge text-bg-light border">
                        {formatActorType(actor.type)}
                      </span>
                    </td>
                    <td>{actor.department.name}</td>
                    <td>
                      {actor.teams.map(({ name }) => name).join(', ') || '—'}
                    </td>
                    <td className="pe-4">{actor.capabilitiesCount}</td>
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

function formatActorType(type: 'AI_AGENT' | 'HUMAN' | 'SERVICE') {
  return type
    .toLowerCase()
    .split('_')
    .map((word) => word[0]?.toUpperCase() + word.slice(1))
    .join(' ')
}
