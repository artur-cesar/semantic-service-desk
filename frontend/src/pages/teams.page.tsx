import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router'

import { getTeams } from '../api/teams.api.js'

export function TeamsPage() {
  const navigate = useNavigate()
  const teams = useQuery({
    queryFn: getTeams,
    queryKey: ['teams'],
  })

  if (teams.isPending) {
    return (
      <div className="d-flex justify-content-center py-5" role="status">
        <div className="spinner-border text-primary" />
        <span className="visually-hidden">Loading teams</span>
      </div>
    )
  }

  if (teams.isError) {
    return (
      <div className="alert alert-danger" role="alert">
        <i className="bi bi-exclamation-triangle-fill me-2" />
        Unable to load teams. Make sure the API is running.
      </div>
    )
  }

  return (
    <div className="vstack gap-4">
      <header className="d-flex align-items-center gap-3">
        <div className="page-icon">
          <i aria-hidden="true" className="bi bi-diagram-3-fill" />
        </div>
        <div>
          <h1 className="h3 mb-1">Teams</h1>
          <p className="text-secondary mb-0">
            Organizational groups responsible for handling service requests.
          </p>
        </div>
      </header>

      {teams.data.teams.length === 0 ? (
        <div className="alert alert-info mb-0" role="status">
          <i className="bi bi-info-circle me-2" />
          No teams are available.
        </div>
      ) : (
        <section className="card border-0 shadow-sm">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-4" scope="col">
                    Team
                  </th>
                  <th scope="col">Code</th>
                  <th scope="col">Department</th>
                  <th className="pe-4" scope="col">
                    Current members
                  </th>
                </tr>
              </thead>
              <tbody>
                {teams.data.teams.map((team) => (
                  <tr
                    aria-label={`View ${team.name}'s profile`}
                    className="clickable-row"
                    key={team.id}
                    onClick={() => void navigate(`/team/${team.id}/profile`)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        void navigate(`/team/${team.id}/profile`)
                      }
                    }}
                    role="link"
                    tabIndex={0}
                  >
                    <td className="ps-4">
                      <div className="fw-semibold">{team.name}</div>
                      <div className="small text-secondary">
                        {team.description ?? 'No description'}
                      </div>
                    </td>
                    <td>
                      <code>{team.code}</code>
                    </td>
                    <td>{team.department.name}</td>
                    <td className="pe-4">
                      <span className="badge text-bg-primary">
                        {team.membersCount}
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
