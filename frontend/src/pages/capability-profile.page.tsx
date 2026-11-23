import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router'

import type { CapabilityDetailsResponse } from '../api/capabilities.api.js'

import { getCapability } from '../api/capabilities.api.js'

type CapabilityActor = CapabilityDetailsResponse['actors'][number]

export function CapabilityProfilePage() {
  const { id } = useParams<{ id: string }>()
  const capabilityQuery = useQuery({
    enabled: Boolean(id),
    queryFn: () => getCapability(id ?? ''),
    queryKey: ['capability', id],
  })

  if (capabilityQuery.isPending) {
    return (
      <div className="d-flex justify-content-center py-5" role="status">
        <div className="spinner-border text-primary" />
        <span className="visually-hidden">Loading capability profile</span>
      </div>
    )
  }

  if (capabilityQuery.isError) {
    return (
      <div className="vstack gap-3">
        <div className="alert alert-danger mb-0" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2" />
          Unable to load the capability. Make sure it exists and the API is
          running.
        </div>
        <div>
          <Link className="btn btn-outline-secondary" to="/capabilities">
            <i aria-hidden="true" className="bi bi-arrow-left me-2" />
            Back to capabilities
          </Link>
        </div>
      </div>
    )
  }

  const capability = capabilityQuery.data
  const currentActors = capability.actors.filter(({ isCurrent }) => isCurrent)
  const history = capability.actors.filter(({ isCurrent }) => !isCurrent)

  return (
    <div className="vstack gap-4">
      <div>
        <Link
          className="link-secondary text-decoration-none"
          to="/capabilities"
        >
          <i aria-hidden="true" className="bi bi-arrow-left me-2" />
          Capabilities
        </Link>
      </div>

      <header className="card border-0 shadow-sm">
        <div className="card-body p-4 d-flex flex-column flex-md-row align-items-md-center gap-3">
          <div aria-hidden="true" className="actor-avatar">
            <i className="bi bi-stars" />
          </div>
          <div className="flex-grow-1">
            <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
              <h1 className="h3 mb-0">{capability.name}</h1>
              <span className="badge text-bg-primary">{capability.code}</span>
            </div>
            <div className="text-secondary">
              {capability.description ?? 'No description'}
            </div>
          </div>
          <div className="text-md-end">
            <div className="small text-secondary">Current actors</div>
            <div className="fs-4 fw-bold">{currentActors.length}</div>
          </div>
        </div>
      </header>

      <ActorGrantSection
        actors={currentActors}
        emptyMessage="No actors currently have this capability."
        title="Actors with this capability"
      />

      {history.length > 0 && (
        <ActorGrantSection
          actors={history}
          emptyMessage="No previous grants."
          title="Grant history"
        />
      )}
    </div>
  )
}

function ActorGrantSection({
  actors,
  emptyMessage,
  title,
}: {
  actors: CapabilityActor[]
  emptyMessage: string
  title: string
}) {
  return (
    <section className="card border-0 shadow-sm">
      <div className="card-header bg-white pt-4 px-4">
        <h2 className="h5 mb-0">
          <i className="bi bi-people me-2 text-primary" />
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
                  <th scope="col">Granted</th>
                  <th className="pe-4" scope="col">
                    Revoked
                  </th>
                </tr>
              </thead>
              <tbody>
                {actors.map((grant) => (
                  <tr key={grant.id}>
                    <td className="ps-4">
                      <Link
                        className="fw-semibold text-decoration-none"
                        to={`/actor/${grant.actor.id}/profile`}
                      >
                        {grant.actor.name}
                      </Link>
                      <div className="small text-secondary">
                        {grant.actor.email ?? 'No email address'}
                      </div>
                    </td>
                    <td>{formatActorType(grant.actor.type)}</td>
                    <td>{formatDate(grant.grantedAt)}</td>
                    <td className="pe-4">
                      {grant.revokedAt
                        ? formatDate(grant.revokedAt)
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

function formatActorType(type: CapabilityActor['actor']['type']) {
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
