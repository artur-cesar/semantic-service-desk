import { NavLink, Outlet } from 'react-router'

export function AppLayout() {
  return (
    <>
      <nav className="navbar navbar-light bg-white border-bottom shadow-sm sticky-top">
        <div className="container py-1">
          <NavLink
            className="navbar-brand d-flex align-items-center gap-2 fw-semibold me-4"
            to="/"
          >
            <span aria-hidden="true" className="brand-icon">
              <i className="bi bi-diagram-3" />
            </span>
            <span>Semantic Service Desk</span>
          </NavLink>

          <div className="navbar-nav flex-row flex-wrap align-items-center gap-1 ms-auto">
            <NavLink className={navLinkClassName} end to="/">
              Home
            </NavLink>
            <NavLink className={navLinkClassName} to="/scenario">
              Scenario
            </NavLink>
            <NavLink className={navLinkClassName} to="/tickets/new">
              Create ticket
            </NavLink>
            <NavLink className={navLinkClassName} to="/analysis">
              Analysis
            </NavLink>
            <span aria-disabled="true" className="nav-link disabled px-2">
              Knowledge graph
            </span>
          </div>
        </div>
      </nav>

      <main className="container py-4">
        <Outlet />
      </main>
    </>
  )
}

function navLinkClassName({ isActive }: { isActive: boolean }) {
  return `nav-link px-2${isActive ? ' active fw-semibold' : ''}`
}
