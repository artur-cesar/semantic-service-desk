import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router'

import type { SystemDetailsResponse } from '../api/systems.api.js'

import { getSystem } from '../api/systems.api.js'

type AuthorizedActor = SystemDetailsResponse['authorizedActors'][number]

export function SystemProfilePage() {
  const { id } = useParams<{ id: string }>()
  const systemQuery = useQuery({
    enabled: Boolean(id),
    queryFn: () => getSystem(id ?? ''),
    queryKey: ['system', id],
  })

  if (systemQuery.isPending) {
    return (
      <div className="d-flex justify-content-center py-5" role="status">
        <div className="spinner-border text-primary" />
        <span className="visually-hidden">Loading system profile</span>
      </div>
    )
  }

  if (systemQuery.isError) {
    return (
      <div className="vstack gap-3">
        <div className="alert alert-danger mb-0" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2" />
          Unable to load the system profile. Make sure the system exists and the
          API is running.
        </div>
        <div>
          <Link className="btn btn-outline-secondary" to="/systems">
            <i aria-hidden="true" className="bi bi-arrow-left me-2" />
            Back to systems
          </Link>
        </div>
      </div>
    )
  }

  const system = systemQuery.data
  const currentActors = system.authorizedActors.filter(
    ({ isCurrent }) => isCurrent,
  )
  const authorizationHistory = system.authorizedActors.filter(
    ({ isCurrent }) => !isCurrent,
  )

  return (
    <div className="vstack gap-4">
      <div>
        <Link className="link-secondary text-decoration-none" to="/systems">
          <i aria-hidden="true" className="bi bi-arrow-left me-2" />
          Systems
        </Link>
      </div>

      <header className="card border-0 shadow-sm">
        <div className="card-body p-4 d-flex flex-column flex-md-row align-items-md-center gap-3">
          <div aria-hidden="true" className="actor-avatar">
            <i className="bi bi-cpu-fill" />
          </div>
          <div className="flex-grow-1">
            <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
              <h1 className="h3 mb-0">{system.name}</h1>
              <span className="badge text-bg-primary">{system.code}</span>
            </div>
            <div className="text-secondary">
              {system.description ?? 'No description'}
            </div>
          </div>
          <div className="text-md-end">
            <div className="small text-secondary">Authorized actors</div>
            <div className="fs-4 fw-bold">{currentActors.length}</div>
          </div>
        </div>
      </header>

      <section className="card border-0 shadow-sm">
        <div className="card-header bg-white pt-4 px-4">
          <h2 className="h5 mb-1">
            <i className="bi bi-lightning-charge me-2 text-primary" />
            Supported actions
          </h2>
        </div>
        <div className="card-body px-4">
          {system.actions.length === 0 ? (
            <p className="text-secondary mb-0">
              No business actions are registered for this system.
            </p>
          ) : (
            <div className="row g-3">
              {system.actions.map((action) => (
                <div className="col-md-6 col-xl-4" key={action.id}>
                  <div className="border rounded-3 p-3 h-100">
                    <div className="fw-semibold">{action.name}</div>
                    <code>{action.code}</code>
                    {action.description && (
                      <div className="small text-secondary mt-2">
                        {action.description}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <AuthorizationSection
        actors={currentActors}
        emptyMessage="No actors are currently authorized for this system."
        title="Authorized actors"
      />

      {authorizationHistory.length > 0 && (
        <AuthorizationSection
          actors={authorizationHistory}
          emptyMessage="No previous authorizations."
          title="Authorization history"
        />
      )}
    </div>
  )
}

function AuthorizationSection({
  actors,
  emptyMessage,
  title,
}: {
  actors: AuthorizedActor[]
  emptyMessage: string
  title: string
}) {
  return (
    <section className="card border-0 shadow-sm">
      <div className="card-header bg-white pt-4 px-4">
        <h2 className="h5 mb-0">
          <i className="bi bi-person-check me-2 text-primary" />
          {title}
        </h2>
      </div>
      <div className="card-body p-0">
        {actors.length === 0 ? (
          <p className="text-secondary px-4 py-3 mb-0">{emptyMessage}</p>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-4" scope="col">
                    Actor
                  </th>
                  <th scope="col">Type</th>
                  <th scope="col">Authorized since</th>
                  <th className="pe-4" scope="col">
                    Revoked
                  </th>
                </tr>
              </thead>
              <tbody>
                {actors.map((authorization) => (
                  <tr key={authorization.id}>
                    <td className="ps-4">
                      <Link
                        className="fw-semibold text-decoration-none"
                        to={`/actor/${authorization.actor.id}/profile`}
                      >
                        {authorization.actor.name}
                      </Link>
                      <div className="small text-secondary">
                        {authorization.actor.email ?? 'No email address'}
                      </div>
                    </td>
                    <td>{formatActorType(authorization.actor.type)}</td>
                    <td>{formatDate(authorization.grantedAt)}</td>
                    <td className="pe-4">
                      {authorization.revokedAt
                        ? formatDate(authorization.revokedAt)
                        : 'Current'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}

function formatActorType(type: AuthorizedActor['actor']['type']) {
  return type
    .toLowerCase()
    .split('_')
    .map((word) => word[0]?.toUpperCase() + word.slice(1))
    .join(' ')
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeZone: 'UTC',
  }).format(new Date(value))
}
