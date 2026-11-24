import { useMutation, useQuery } from '@tanstack/react-query'
import { type FormEvent, useState } from 'react'

import { getActors } from '../api/actors.api.js'
import { createTicket, type TicketPriority } from '../api/tickets.api.js'

export function CreateTicketPage() {
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<TicketPriority>('MEDIUM')
  const [requesterId, setRequesterId] = useState('')
  const [title, setTitle] = useState('')
  const [wasValidated, setWasValidated] = useState(false)
  const actors = useQuery({ queryFn: getActors, queryKey: ['actors'] })
  const ticket = useMutation({
    mutationFn: createTicket,
    onSuccess: () => {
      setDescription('')
      setPriority('MEDIUM')
      setRequesterId('')
      setTitle('')
      setWasValidated(false)
    },
  })

  const requesters =
    actors.data?.actors.filter((actor) => actor.type === 'HUMAN') ?? []
  const canSubmit =
    requesterId !== '' && title.trim() !== '' && description.trim() !== ''

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setWasValidated(true)

    if (!event.currentTarget.checkValidity() || !canSubmit) {
      return
    }

    ticket.mutate({ description, priority, requesterId, title })
  }

  return (
    <div className="vstack gap-4">
      <header className="d-flex align-items-center gap-3">
        <div className="page-icon">
          <i aria-hidden="true" className="bi bi-ticket-perforated-fill" />
        </div>
        <div>
          <h1 className="h3 mb-1">Create ticket</h1>
          <p className="text-secondary mb-0">
            Record the request exactly as the requester describes it. The
            taxonomy will be added during a later analysis.
          </p>
        </div>
      </header>

      <div className="row g-4 align-items-start">
        <div className="col-12 col-lg-8">
          <section className="card border-0 shadow-sm">
            <div className="card-body p-4">
              {actors.isError ? (
                <div className="alert alert-danger" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2" />
                  Unable to load requesters. Make sure the API is running.
                </div>
              ) : null}

              {ticket.isError ? (
                <div className="alert alert-danger" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2" />
                  The ticket could not be created. Review the information and
                  try again.
                </div>
              ) : null}

              <form
                className={`vstack gap-3 needs-validation${wasValidated ? ' was-validated' : ''}`}
                noValidate
                onSubmit={submit}
              >
                <div>
                  <label className="form-label" htmlFor="requester">
                    Requester{' '}
                    <span aria-hidden="true" className="text-danger">
                      *
                    </span>
                    <span className="visually-hidden"> (required)</span>
                  </label>
                  <select
                    className="form-select form-control-lg"
                    disabled={actors.isPending || actors.isError}
                    id="requester"
                    onChange={(event) => setRequesterId(event.target.value)}
                    required
                    value={requesterId}
                  >
                    <option value="">
                      {actors.isPending
                        ? 'Loading requesters...'
                        : 'Select a requester'}
                    </option>
                    {requesters.map((requester) => (
                      <option key={requester.id} value={requester.id}>
                        {requester.name} — {requester.department.name}
                      </option>
                    ))}
                  </select>
                  <div className="invalid-feedback">
                    Select the person requesting support.
                  </div>
                  {!actors.isPending &&
                  !actors.isError &&
                  requesters.length === 0 ? (
                    <div className="form-text text-danger">
                      No human actors are available as requesters.
                    </div>
                  ) : null}
                </div>

                <div>
                  <label className="form-label" htmlFor="title">
                    Title{' '}
                    <span aria-hidden="true" className="text-danger">
                      *
                    </span>
                    <span className="visually-hidden"> (required)</span>
                  </label>
                  <input
                    className="form-control form-control-lg"
                    id="title"
                    maxLength={160}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Summarize the request"
                    required
                    type="text"
                    value={title}
                  />
                  <div className="invalid-feedback">
                    Enter a short title for the ticket.
                  </div>
                </div>

                <div>
                  <label className="form-label" htmlFor="description">
                    Request in natural language{' '}
                    <span aria-hidden="true" className="text-danger">
                      *
                    </span>
                    <span className="visually-hidden"> (required)</span>
                  </label>
                  <textarea
                    className="form-control"
                    id="description"
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="For example: I changed departments and can no longer approve purchase orders in the ERP."
                    required
                    rows={7}
                    value={description}
                  />
                  <div className="invalid-feedback">
                    Describe the request in the requester&apos;s own words.
                  </div>
                  <div className="form-text">
                    Keep the original wording. It will become the input for the
                    future LLM extraction step.
                  </div>
                </div>

                <div>
                  <label className="form-label" htmlFor="priority">
                    Priority{' '}
                    <span aria-hidden="true" className="text-danger">
                      *
                    </span>
                    <span className="visually-hidden"> (required)</span>
                  </label>
                  <select
                    className="form-select form-control-lg"
                    id="priority"
                    onChange={(event) =>
                      setPriority(event.target.value as TicketPriority)
                    }
                    required
                    value={priority}
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>

                <div className="d-flex justify-content-end pt-2">
                  <button
                    className="btn btn-primary"
                    disabled={
                      !canSubmit ||
                      ticket.isPending ||
                      actors.isPending ||
                      requesters.length === 0
                    }
                    type="submit"
                  >
                    {ticket.isPending ? (
                      <>
                        <span
                          aria-hidden="true"
                          className="spinner-border spinner-border-sm me-2"
                        />
                        Creating ticket...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-plus-circle me-2" />
                        Create ticket
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </section>
        </div>

        <div className="col-12 col-lg-4">
          {ticket.data ? (
            <CreatedTicketCard ticket={ticket.data} />
          ) : (
            <aside className="card border-0 bg-body-tertiary">
              <div className="card-body p-4">
                <h2 className="h6">
                  <i className="bi bi-info-circle me-2" />
                  Before analysis
                </h2>
                <p className="small text-secondary mb-0">
                  This step only persists the request. System, category, action,
                  team, and assignee intentionally remain empty until the
                  analysis workflow is introduced.
                </p>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  )
}

function CreatedTicketCard({
  ticket,
}: {
  ticket: Awaited<ReturnType<typeof createTicket>>
}) {
  return (
    <aside className="card border-success shadow-sm">
      <div className="card-header bg-success-subtle text-success-emphasis d-flex align-items-center gap-2">
        <i className="bi bi-check-circle-fill" />
        <span className="fw-semibold">Ticket created</span>
      </div>
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
          <div>
            <div className="small text-secondary">Ticket</div>
            <div className="h4 mb-0">#{ticket.number}</div>
          </div>
          <span className="badge text-bg-primary">{ticket.status}</span>
        </div>
        <h2 className="h6">{ticket.title}</h2>
        <p className="small text-secondary">{ticket.description}</p>
        <dl className="row small mb-0">
          <dt className="col-5">Priority</dt>
          <dd className="col-7">{ticket.priority}</dd>
          <dt className="col-5">Ticket ID</dt>
          <dd className="col-7 font-monospace text-break">{ticket.id}</dd>
        </dl>
      </div>
    </aside>
  )
}
