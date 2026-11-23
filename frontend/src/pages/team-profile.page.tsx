import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router'

import type { TeamDetailsResponse } from '../api/teams.api.js'

import { getTeam } from '../api/teams.api.js'

type TeamMember = TeamDetailsResponse['members'][number]

export function TeamProfilePage() {
  const { id } = useParams<{ id: string }>()
  const teamQuery = useQuery({
    enabled: Boolean(id),
    queryFn: () => getTeam(id ?? ''),
    queryKey: ['team', id],
  })

  if (teamQuery.isPending) {
    return (
      <div className="d-flex justify-content-center py-5" role="status">
        <div className="spinner-border text-primary" />
        <span className="visually-hidden">Loading team profile</span>
      </div>
    )
  }

  if (teamQuery.isError) {
    return (
      <div className="vstack gap-3">
        <div className="alert alert-danger mb-0" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2" />
          Unable to load the team profile. Make sure the team exists and the API
          is running.
        </div>
        <div>
          <Link className="btn btn-outline-secondary" to="/teams">
            <i aria-hidden="true" className="bi bi-arrow-left me-2" />
            Back to teams
          </Link>
        </div>
      </div>
    )
  }

  const team = teamQuery.data
  const currentMembers = team.members.filter(({ isCurrent }) => isCurrent)
  const formerMembers = team.members.filter(({ isCurrent }) => !isCurrent)

  return (
    <div className="vstack gap-4">
      <div>
        <Link className="link-secondary text-decoration-none" to="/teams">
          <i aria-hidden="true" className="bi bi-arrow-left me-2" />
          Teams
        </Link>
      </div>

      <header className="card border-0 shadow-sm">
        <div className="card-body p-4 d-flex flex-column flex-md-row align-items-md-center gap-3">
          <div aria-hidden="true" className="actor-avatar">
            <i className="bi bi-diagram-3-fill" />
          </div>
          <div className="flex-grow-1">
            <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
              <h1 className="h3 mb-0">{team.name}</h1>
              <span className="badge text-bg-primary">{team.code}</span>
            </div>
            <div className="text-secondary">
              {team.description ?? 'No description'}
            </div>
          </div>
          <div className="text-md-end">
            <div className="small text-secondary">Current members</div>
            <div className="fs-4 fw-bold">{currentMembers.length}</div>
          </div>
        </div>
      </header>

      <section className="card border-0 shadow-sm">
        <div className="card-header bg-white pt-4 px-4">
          <h2 className="h5 mb-1">
            <i className="bi bi-building me-2 text-primary" />
            Department
          </h2>
        </div>
        <div className="card-body px-4">
          <div className="fw-semibold">{team.department.name}</div>
          <code>{team.department.code}</code>
          {team.department.description && (
            <p className="text-secondary mt-2 mb-0">
              {team.department.description}
            </p>
          )}
        </div>
      </section>

      <MembershipSection
        emptyMessage="This team has no current members."
        members={currentMembers}
        title="Current members"
      />

      {formerMembers.length > 0 && (
        <MembershipSection
          emptyMessage="This team has no former members."
          members={formerMembers}
          title="Membership history"
        />
      )}
    </div>
  )
}

function formatActorType(type: TeamMember['actor']['type']) {
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

function MembershipSection({
  emptyMessage,
  members,
  title,
}: {
  emptyMessage: string
  members: TeamMember[]
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
        {members.length === 0 ? (
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
                  <th scope="col">Joined</th>
                  <th className="pe-4" scope="col">
                    Ended
                  </th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr key={member.id}>
                    <td className="ps-4">
                      <Link
                        className="fw-semibold text-decoration-none"
                        to={`/actor/${member.actor.id}/profile`}
                      >
                        {member.actor.name}
                      </Link>
                      <div className="small text-secondary">
                        {member.actor.email ?? 'No email address'}
                      </div>
                    </td>
                    <td>{formatActorType(member.actor.type)}</td>
                    <td>{formatDate(member.startedAt)}</td>
                    <td className="pe-4">
                      {member.endedAt ? formatDate(member.endedAt) : 'Current'}
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
