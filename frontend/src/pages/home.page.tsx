import { Link } from 'react-router'

const studyTopics = [
  [
    'bi-chat-square-text',
    'LLM extraction',
    'Interpret a ticket written in natural language.',
  ],
  [
    'bi-diagram-3',
    'Ontology',
    'Represent shared concepts and infer implicit relations.',
  ],
  [
    'bi-check2-square',
    'Deterministic rules',
    'Keep eligibility explicit, reproducible, and testable.',
  ],
  [
    'bi-person-check',
    'Human in the loop',
    'Allow a person to inspect and approve the result.',
  ],
] as const

const processSteps = [
  [
    '1',
    'The ticket starts with a human report',
    'A requester describes a problem using ordinary language. The original text remains part of the ticket.',
  ],
  [
    '2',
    'The LLM extracts candidate facts',
    'The model proposes a system, action, department, problem category, and supporting evidence.',
  ],
  [
    '3',
    'The taxonomy normalizes the extraction',
    'The application maps suggestions to known identifiers. Unknown values remain visible for review.',
  ],
  [
    '4',
    'Rules evaluate actor eligibility',
    'Ontology and policy rules derive requirements, eliminate invalid candidates, and persist explanations.',
  ],
] as const

const contexts = [
  [
    '01',
    'Identity and organization',
    'Actor · Department · Team · Membership',
    'Who participates, where they work, and how people are grouped for routing.',
  ],
  [
    '02',
    'Service catalog and taxonomy',
    'System · Action · Capability · Category',
    'The controlled vocabulary used to interpret and classify a request.',
  ],
  [
    '03',
    'Ticketing',
    'Ticket · Comment · Event',
    'The operational request, its state, collaboration, and immutable history.',
  ],
  [
    '04',
    'Ticket analysis',
    'Analysis · Requirement · Evaluation',
    'An immutable inference attempt with requirements, candidates, and explanations.',
  ],
] as const

export function HomePage() {
  return (
    <div className="py-lg-3">
      <header className="project-header border-bottom pb-4 mb-4">
        <div className="row align-items-end g-4">
          <div className="col-lg-8">
            <div className="small text-primary text-uppercase fw-semibold mb-2">
              Personal study project
            </div>
            <h1 className="display-6 fw-semibold mb-3">
              Semantic Service Desk
            </h1>
            <p className="lead text-secondary mb-0">
              An educational service desk used to explore how LLM extraction,
              domain modeling, ontologies, deterministic rules, and human review
              can work together in an agentic system.
            </p>
          </div>
          <div className="col-lg-4 text-lg-end">
            <Link className="btn btn-outline-primary" to="/scenario">
              Open the example scenario
              <i aria-hidden="true" className="bi bi-arrow-right ms-2" />
            </Link>
          </div>
        </div>
      </header>

      <section aria-labelledby="project-scope" className="mb-5">
        <h2 className="h4" id="project-scope">
          What this repository explores
        </h2>
        <p className="text-secondary">
          The service desk domain is large enough to demonstrate meaningful
          relations, but small enough to inspect locally from the API, database,
          and interface.
        </p>
        <div className="row g-3">
          {studyTopics.map(([icon, title, text]) => (
            <div className="col-md-6 col-xl-3" key={title}>
              <div className="h-100 border-start border-3 border-primary ps-3 py-1">
                <i aria-hidden="true" className={`bi ${icon} text-primary`} />
                <h3 className="h6 mt-2 mb-1">{title}</h3>
                <p className="small text-secondary mb-0">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <DocumentationSection
        eyebrow="Conceptual workflow"
        id="workflow"
        subtitle="Each stage has a narrow responsibility. The LLM helps interpret language, but it does not own the final decision."
        title="From human language to an explainable recommendation"
      >
        <div className="vstack gap-3 mt-4">
          {processSteps.map(([number, title, text]) => (
            <article
              className="process-step border rounded-3 p-3 p-md-4 bg-white"
              key={number}
            >
              <div className="process-number">{number}</div>
              <div>
                <h3 className="h6 mb-1">{title}</h3>
                <p className="text-secondary mb-0">{text}</p>
              </div>
            </article>
          ))}
        </div>
      </DocumentationSection>

      <DocumentationSection
        eyebrow="Supporting model"
        id="model"
        subtitle="These contexts replace one large relationship diagram as the main explanation. Together, they form the complete model."
        title="The model is introduced in small contexts"
      >
        <div className="row g-3 mt-2">
          {contexts.map(([number, title, entities, text]) => (
            <div className="col-md-6" key={number}>
              <div className="card h-100 border">
                <div className="card-body p-4">
                  <div className="small text-primary fw-semibold mb-2">
                    {number}
                  </div>
                  <h3 className="h5">{title}</h3>
                  <p className="text-secondary">{text}</p>
                  <code>{entities}</code>
                </div>
              </div>
            </div>
          ))}
        </div>
      </DocumentationSection>

      <DocumentationSection
        eyebrow="Eligibility"
        id="relations"
        subtitle="Eligibility is the intersection of independent facts. Each relation remains visible and can be inspected from the scenario."
        title="No single relation selects a resolver"
      >
        <div className="relation-expression my-4">
          <RelationTerm label="Active actor" to="/actors" />
          <RelationOperator value="+" />
          <RelationTerm label="Capability" to="/capabilities" />
          <RelationOperator value="+" />
          <RelationTerm label="System authorization" to="/systems" />
          <RelationOperator value="+" />
          <RelationTerm label="Team context" to="/teams" />
          <RelationOperator value="→" />
          <span className="relation-result">Eligible candidate</span>
        </div>
        <div className="alert alert-light border mb-0">
          A capability describes what an actor knows how to do. A system
          authorization describes where that actor may act. Team membership
          provides organizational context. Keeping them separate makes every
          eligibility outcome explainable.
        </div>
      </DocumentationSection>

      <DocumentationSection
        eyebrow="Repository scenario"
        id="example"
        subtitle="The current seed makes the intended inference inspectable before an LLM or ontology engine is connected."
        title="A concrete example using the seeded data"
      >
        <p className="mt-4 mb-3">
          Consider an organization with an ERP and an Identity Provider, a
          Purchasing department that uses the ERP, and an Information Technology
          department responsible for supporting those systems. The seed
          introduces three human actors with deliberately different
          relationships:
        </p>
        <div className="row g-3 mb-4">
          <SeedActorCard
            authorizations={[]}
            capabilities={[]}
            department="Purchasing"
            name="João"
            teams={[]}
            type="Human · Requester"
          />
          <SeedActorCard
            authorizations={['ERP']}
            capabilities={['ERP Access Management', 'Identity Management']}
            department="Information Technology"
            name="Carla"
            teams={['ERP Support']}
            type="Human · Resolver candidate"
          />
          <SeedActorCard
            authorizations={['ERP']}
            capabilities={['Platform Operations']}
            department="Information Technology"
            name="Diego"
            teams={['Platform Operations']}
            type="Human · Resolver candidate"
          />
        </div>
        <p className="text-secondary mb-3">
          When an actor such as João encounters a problem, he does not need to
          understand this model or choose a resolver himself. He creates a
          ticket in ordinary language, describing what changed, what he is
          trying to do, and where the failure occurs. That report becomes the
          starting point for extraction, normalization, and eligibility
          analysis.
        </p>
        <div className="card border shadow-sm mt-4 overflow-hidden">
          <div className="card-header bg-white d-flex align-items-center gap-2 py-3">
            <i
              aria-hidden="true"
              className="bi bi-ticket-perforated text-primary"
            />
            <h3 className="h6 mb-0">Input ticket</h3>
          </div>
          <div className="card-body p-4 p-md-5">
            <figure className="mb-0">
              <blockquote className="blockquote border-start border-primary border-4 ps-3 mb-3">
                <p className="fs-5 mb-0">
                  I moved departments and can no longer approve purchase orders
                  in the ERP.
                </p>
              </blockquote>
              <figcaption className="blockquote-footer mb-0 ms-3">
                João, requester from <cite>Purchasing</cite>
              </figcaption>
            </figure>
          </div>
        </div>
        <p className="text-secondary mt-4 mb-3">
          From this report, the LLM proposes structured facts that the
          application resolves against its known taxonomy. Ontology and policy
          rules then use those normalized facts to derive the capabilities and
          authorizations required by the ticket. Only after those requirements
          are explicit does the system evaluate each candidate and record why
          that actor is eligible or ineligible.
        </p>
        <div className="row g-3 mt-1">
          <ExampleColumn title="Normalized facts">
            <Definition label="System" value="ERP" />
            <Definition label="Action" value="Approve purchase order" />
            <Definition label="Problem" value="Missing permission" />
            <Definition label="Context" value="Department change" />
          </ExampleColumn>
          <ExampleColumn title="Derived requirement">
            <Definition
              label="Required capability"
              value="ERP Access Management"
            />
            <Definition label="Required authorization" value="ERP" />
            <Definition label="Policy" value="Actor must be active" />
          </ExampleColumn>
          <ExampleColumn title="Candidate evaluation">
            <CandidateResult
              explanation="Capability and ERP authorization are present."
              name="Carla"
              result="Eligible"
              success
            />
            <CandidateResult
              explanation="ERP authorization exists, but the capability is missing."
              name="Diego"
              result="Ineligible"
            />
          </ExampleColumn>
        </div>
      </DocumentationSection>

      <DocumentationSection
        eyebrow="Planned experiment"
        id="next"
        subtitle="These flows are intentionally visible in the navigation even while their pages are still under development."
        title="What will be added next"
      >
        <div className="row g-3 mt-2">
          <RoadmapItem text="Create a ticket from a natural-language report." />
          <RoadmapItem text="Review and correct facts proposed by the LLM." />
          <RoadmapItem text="Run ontology and policy analysis on demand." />
          <RoadmapItem text="Inspect and approve actor evaluations." />
        </div>
      </DocumentationSection>

      <section
        aria-labelledby="references"
        className="border-top pt-4 mt-5 mb-3"
      >
        <h2 className="h5" id="references">
          Technical references
        </h2>
        <p className="small text-secondary">
          Starting points for the standards behind the future ontology layer.
        </p>
        <div className="d-flex flex-wrap gap-3 small">
          <ExternalLink
            label="RDF 1.1 Concepts"
            url="https://www.w3.org/TR/rdf11-concepts/"
          />
          <ExternalLink
            label="OWL 2 Overview"
            url="https://www.w3.org/TR/owl-overview/"
          />
          <ExternalLink
            label="OWL 2 Primer"
            url="https://www.w3.org/TR/owl2-primer/"
          />
        </div>
      </section>
    </div>
  )
}

function ActorRelations({
  label,
  values,
}: {
  label: string
  values: string[]
}) {
  return (
    <div className="mb-3">
      <div className="small text-secondary mb-1">{label}</div>
      {values.length === 0 ? (
        <span className="small text-secondary">None</span>
      ) : (
        <div className="d-flex flex-wrap gap-1">
          {values.map((value) => (
            <span className="badge text-bg-light border text-dark" key={value}>
              {value}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

function CandidateResult({
  explanation,
  name,
  result,
  success = false,
}: {
  explanation: string
  name: string
  result: string
  success?: boolean
}) {
  return (
    <div className="border rounded-3 p-3 mb-2">
      <div className="d-flex justify-content-between gap-2 mb-1">
        <span className="fw-semibold">{name}</span>
        <span className={`badge text-bg-${success ? 'success' : 'secondary'}`}>
          {result}
        </span>
      </div>
      <div className="small text-secondary">{explanation}</div>
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

function DocumentationSection({
  children,
  eyebrow,
  id,
  subtitle,
  title,
}: {
  children: React.ReactNode
  eyebrow: string
  id: string
  subtitle: string
  title: string
}) {
  return (
    <section aria-labelledby={id} className="documentation-section">
      <div className="section-heading">
        <div className="small text-primary text-uppercase fw-semibold">
          {eyebrow}
        </div>
        <h2 className="h3 mb-2" id={id}>
          {title}
        </h2>
        <p className="text-secondary mb-0">{subtitle}</p>
      </div>
      {children}
    </section>
  )
}

function ExampleColumn({
  children,
  title,
}: {
  children: React.ReactNode
  title: string
}) {
  return (
    <div className="col-lg-4">
      <div className="card h-100 border">
        <div className="card-header bg-white fw-semibold py-3">{title}</div>
        <div className="card-body">{children}</div>
      </div>
    </div>
  )
}

function ExternalLink({ label, url }: { label: string; url: string }) {
  return (
    <a href={url} rel="noreferrer" target="_blank">
      {label}
      <i aria-hidden="true" className="bi bi-box-arrow-up-right ms-1" />
    </a>
  )
}

function RelationOperator({ value }: { value: string }) {
  return <span className="relation-operator">{value}</span>
}

function RelationTerm({ label, to }: { label: string; to: string }) {
  return (
    <Link className="relation-term" to={to}>
      {label}
    </Link>
  )
}

function RoadmapItem({ text }: { text: string }) {
  return (
    <div className="col-md-6">
      <div className="d-flex gap-3 border rounded-3 p-3 h-100 bg-white">
        <i aria-hidden="true" className="bi bi-circle text-secondary" />
        <span>{text}</span>
      </div>
    </div>
  )
}

function SeedActorCard({
  authorizations,
  capabilities,
  department,
  name,
  teams,
  type,
}: {
  authorizations: string[]
  capabilities: string[]
  department: string
  name: string
  teams: string[]
  type: string
}) {
  return (
    <div className="col-lg-4">
      <article className="card h-100 border">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-start gap-2 mb-3">
            <div>
              <h3 className="h5 mb-1">{name}</h3>
              <div className="small text-secondary">{type}</div>
            </div>
            <i
              aria-hidden="true"
              className="bi bi-person-circle fs-4 text-primary"
            />
          </div>
          <Definition label="Department" value={department} />
          <ActorRelations label="Team membership" values={teams} />
          <ActorRelations label="Capabilities" values={capabilities} />
          <ActorRelations
            label="System authorization"
            values={authorizations}
          />
        </div>
      </article>
    </div>
  )
}
