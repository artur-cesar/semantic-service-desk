import { NavLink, Outlet } from 'react-router'

export function AppLayout() {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
        <div className="container-fluid px-lg-4">
          <NavLink className="navbar-brand fw-semibold" to="/scenario">
            <i aria-hidden="true" className="bi bi-diagram-3 me-2" />
            Semantic Service Desk
          </NavLink>
        </div>
      </nav>

      <main className="container-fluid px-3 px-lg-4 py-4">
        <Outlet />
      </main>
    </>
  )
}
