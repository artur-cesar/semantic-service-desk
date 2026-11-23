import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router'

import { getActor } from '../api/actors.api.js'

export function ActorProfilePage() {
  const { id } = useParams<{ id: string }>()
  const actorQuery = useQuery({
    enabled: Boolean(id),
    queryFn: () => getActor(id ?? ''),
    queryKey: ['actor', id],
  })

  if (actorQuery.isPending) {
    return (
      <div className="d-flex justify-content-center py-5" role="status">
        <div className="spinner-border text-primary" />
        <span className="visually-hidden">Loading actor profile</span>
      </div>
    )
  }

  if (actorQuery.isError) {
    return (
      <div className="alert alert-danger" role="alert">
        <i className="bi bi-exclamation-triangle-fill me-2" />
        Unable to load the actor profile. Make sure the API is running.
      </div>
    )
  }

  const actor = actorQuery.data

  return (
    <div className="vstack gap-4">
      <div>
        <Link className="link-secondary text-decoration-none" to="/actors">
          <i aria-hidden="true" className="bi bi-arrow-left me-2" />
          Actors
        </Link>
      </div>

      <header className="card border-0 shadow-sm">
        <div className="card-body p-4 d-flex flex-column flex-md-row align-items-md-center gap-3">
          <div aria-hidden="true" className="actor-avatar">
            <i className="bi bi-person-fill" />
          </div>
          <div className="flex-grow-1">
            <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
              <h1 className="h3 mb-0">{actor.name}</h1>
              <span className="badge text-bg-primary">
                {formatActorType(actor.type)}
              </span>
            </div>
            <div className="text-secondary">
              {actor.email ?? 'No email address'}
            </div>
          </div>
          <div className="text-md-end">
            <div className="small text-secondary">Actor ID</div>
            <code>{actor.id}</code>
          </div>
        </div>
      </header>

      <div className="row g-4">
        <section className="col-lg-5">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white pt-4 px-4">
              <h2 className="h5 mb-0">
                <i className="bi bi-building me-2 text-primary" />
                Organization
              </h2>
            </div>
            <div className="card-body px-4">
              <Definition label="Department" value={actor.department.name} />
              <Definition
                label="Department code"
                value={actor.department.code}
              />
              <hr />
              <h3 className="h6">Teams</h3>
              {actor.memberships.length === 0 ? (
                <p className="text-secondary mb-0">No team memberships.</p>
              ) : (
                <div className="list-group list-group-flush">
                  {actor.memberships.map((membership) => (
                    <div className="list-group-item px-0" key={membership.id}>
                      <div className="d-flex justify-content-between gap-3">
                        <span className="fw-semibold">
                          {membership.team.name}
                        </span>
                        <code>{membership.team.code}</code>
                      </div>
                      {membership.team.description && (
                        <div className="small text-secondary mt-1">
                          {membership.team.description}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="col-lg-7">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white pt-4 px-4">
              <h2 className="h5 mb-0">
                <i className="bi bi-stars me-2 text-primary" />
                Capabilities
              </h2>
            </div>
            <div className="card-body px-4">
              {actor.capabilities.length === 0 ? (
                <p className="text-secondary mb-0">
                  No capabilities assigned to this actor.
                </p>
              ) : (
                <div className="row g-3">
                  {actor.capabilities.map((grant) => (
                    <div className="col-md-6" key={grant.id}>
                      <div className="border rounded-3 p-3 h-100">
                        <div className="d-flex justify-content-between gap-2">
                          <span className="fw-semibold">
                            {grant.capability.name}
                          </span>
                          <code>{grant.capability.code}</code>
                        </div>
                        {grant.capability.description && (
                          <div className="small text-secondary mt-2">
                            {grant.capability.description}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      <section className="card border-0 shadow-sm">
        <div className="card-header bg-white pt-4 px-4">
          <h2 className="h5 mb-1">
            <i className="bi bi-shield-check me-2 text-primary" />
            System authorizations
          </h2>
          <p className="small text-secondary mb-0">
            Systems where this actor is authorized to perform work.
          </p>
        </div>
        <div className="card-body px-4">
          {actor.authorizations.length === 0 ? (
            <p className="text-secondary mb-0">No system authorizations.</p>
          ) : (
            <div className="d-flex flex-wrap gap-2">
              {actor.authorizations.map(({ id, system }) => (
                <span className="badge text-bg-success fs-6" key={id}>
                  <i aria-hidden="true" className="bi bi-check-circle me-2" />
                  {system.name}
                  <span className="opacity-75 ms-2">{system.code}</span>
                </span>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

function Definition({ label, value }: { label: string; value: string }) {
  return (
    <div className="mb-3">
      <div className="small text-secondary">{label}</div>
      <div className="fw-semibold">{value}</div>
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
