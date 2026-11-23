import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router'

import { getScenario } from '../api/scenario.api.js'

interface BadgeListProperties {
  emptyLabel: string
  items: { id: string; name: string }[]
  variant?: 'primary' | 'success'
}

interface SummaryCardProperties {
  icon: string
  label: string
  to?: string
  value: number
}

export function ScenarioPage() {
  const scenario = useQuery({
    queryFn: getScenario,
    queryKey: ['scenario'],
  })

  if (scenario.isPending) {
    return (
      <div className="d-flex justify-content-center py-5" role="status">
        <div className="spinner-border text-primary" />
        <span className="visually-hidden">Loading scenario</span>
      </div>
    )
  }

  if (scenario.isError) {
    return (
      <div className="alert alert-danger" role="alert">
        <i className="bi bi-exclamation-triangle-fill me-2" />
        Unable to load the scenario. Make sure the API is running.
      </div>
    )
  }

  return (
    <div className="vstack gap-4">
      <header>
        <div className="d-flex align-items-center gap-3">
          <div className="page-icon">
            <i aria-hidden="true" className="bi bi-grid-1x2-fill" />
          </div>
          <div>
            <h1 className="h3 mb-1">Scenario</h1>
            <p className="text-secondary mb-0">
              Data supporting actor classification and eligibility.
            </p>
          </div>
        </div>
      </header>

      <section aria-label="Scenario summary" className="row g-3">
        <SummaryCard
          icon="bi-people"
          label="Actors"
          to="/actors"
          value={scenario.data.actors.length}
        />
        <SummaryCard
          icon="bi-building"
          label="Teams"
          to="/teams"
          value={scenario.data.teams.length}
        />
        <SummaryCard
          icon="bi-cpu"
          label="Systems"
          to="/systems"
          value={scenario.data.systems.length}
        />
        <SummaryCard
          icon="bi-stars"
          label="Capabilities"
          value={scenario.data.capabilities.length}
        />
      </section>

      <section className="card border-0 shadow-sm">
        <div className="card-header bg-white border-bottom-0 pt-4 px-4">
          <h2 className="h5 mb-1">Actors and eligibility</h2>
          <p className="text-secondary small mb-0">
            Active relationships among departments, teams, capabilities, and
            systems.
          </p>
        </div>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="ps-4" scope="col">
                  Actor
                </th>
                <th scope="col">Department</th>
                <th scope="col">Teams</th>
                <th scope="col">Capabilities</th>
                <th className="pe-4" scope="col">
                  Authorized systems
                </th>
              </tr>
            </thead>
            <tbody>
              {scenario.data.actors.map((actor) => (
                <tr key={actor.id}>
                  <td className="ps-4">
                    <div className="fw-semibold">{actor.name}</div>
                    <div className="text-secondary small">
                      {actor.email ?? actor.type}
                    </div>
                  </td>
                  <td>{actor.department.name}</td>
                  <td>
                    <BadgeList emptyLabel="No team" items={actor.teams} />
                  </td>
                  <td>
                    <BadgeList
                      emptyLabel="No capability"
                      items={actor.capabilities}
                    />
                  </td>
                  <td className="pe-4">
                    <BadgeList
                      emptyLabel="No authorization"
                      items={actor.authorizedSystems}
                      variant="success"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="row g-4">
        <section className="col-xl-7">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white pt-4 px-4">
              <h2 className="h5 mb-0">
                <i className="bi bi-cpu me-2 text-primary" />
                Systems and actions
              </h2>
            </div>
            <div className="list-group list-group-flush">
              {scenario.data.systems.map((system) => (
                <div className="list-group-item px-4 py-3" key={system.id}>
                  <div className="d-flex justify-content-between gap-3">
                    <div>
                      <div className="fw-semibold">{system.name}</div>
                      <div className="small text-secondary">
                        {system.description}
                      </div>
                    </div>
                    <span className="badge text-bg-dark align-self-start">
                      {system.code}
                    </span>
                  </div>
                  <div className="d-flex flex-wrap gap-2 mt-3">
                    {system.actions.map((action) => (
                      <span
                        className="badge text-bg-light border"
                        key={action.id}
                      >
                        {action.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="col-xl-5">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white pt-4 px-4">
              <h2 className="h5 mb-0">
                <i className="bi bi-tags me-2 text-primary" />
                Categories
              </h2>
            </div>
            <div className="list-group list-group-flush">
              {scenario.data.categories.map((category) => (
                <div className="list-group-item px-4 py-3" key={category.id}>
                  <div className="fw-semibold">{category.name}</div>
                  <div className="small text-secondary">
                    {category.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

function BadgeList({
  emptyLabel,
  items,
  variant = 'primary',
}: BadgeListProperties) {
  if (items.length === 0)
    return <span className="text-secondary small">{emptyLabel}</span>

  return (
    <div className="d-flex flex-wrap gap-1">
      {items.map((item) => (
        <span className={`badge text-bg-${variant}`} key={item.id}>
          {item.name}
        </span>
      ))}
    </div>
  )
}

function SummaryCard({ icon, label, to, value }: SummaryCardProperties) {
  const card = (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body d-flex align-items-center gap-3">
        <div className="summary-icon">
          <i className={`bi ${icon}`} />
        </div>
        <div>
          <div className="fs-4 fw-bold">{value}</div>
          <div className="text-secondary small">{label}</div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="col-6 col-xl-3">
      {to ? (
        <Link
          aria-label={`View ${label.toLowerCase()}`}
          className="clickable-card d-block h-100 text-decoration-none text-body"
          to={to}
        >
          {card}
        </Link>
      ) : (
        card
      )}
    </div>
  )
}
