import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router'

import { AppLayout } from './components/app-layout.js'
import { ActorProfilePage } from './pages/actor-profile.page.js'
import { ActorsPage } from './pages/actors.page.js'
import { ScenarioPage } from './pages/scenario.page.js'
import { TeamProfilePage } from './pages/team-profile.page.js'
import { TeamsPage } from './pages/teams.page.js'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30_000,
    },
  },
})

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route element={<ScenarioPage />} path="/scenario" />
            <Route element={<ActorsPage />} path="/actors" />
            <Route element={<ActorProfilePage />} path="/actor/:id/profile" />
            <Route element={<TeamsPage />} path="/teams" />
            <Route element={<TeamProfilePage />} path="/team/:id/profile" />
            <Route element={<Navigate replace to="/scenario" />} path="*" />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
