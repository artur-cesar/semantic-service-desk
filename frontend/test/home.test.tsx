import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { expect, test } from 'vitest'

import { AppLayout } from '../src/components/app-layout.js'
import { HomePage } from '../src/pages/home.page.js'

test('presents the project story and exploration links', () => {
  renderHome()

  expect(
    screen.getByRole('heading', {
      name: 'Semantic Service Desk',
    }),
  ).toBeInTheDocument()
  expect(
    screen.getByRole('link', { name: /Open the example scenario/ }),
  ).toHaveAttribute('href', '/scenario')
  expect(screen.getByRole('link', { name: 'Capability' })).toHaveAttribute(
    'href',
    '/capabilities',
  )
  expect(screen.getByRole('link', { name: 'OWL 2 Primer' })).toHaveAttribute(
    'href',
    'https://www.w3.org/TR/owl2-primer/',
  )
  expect(screen.getByRole('heading', { name: 'João' })).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: 'Carla' })).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: 'Diego' })).toBeInTheDocument()
  expect(screen.getByText('ERP Support')).toBeInTheDocument()
})

test('uses a shared navbar with current and future navigation', () => {
  renderHome()

  expect(
    screen.getByRole('link', { name: 'Semantic Service Desk' }),
  ).toHaveAttribute('href', '/')
  expect(screen.getByRole('link', { name: 'Home' })).toHaveClass('active')
  expect(screen.getByRole('link', { name: 'Scenario' })).toHaveAttribute(
    'href',
    '/scenario',
  )
  expect(screen.getByText('Create ticket')).toHaveClass('disabled')
  expect(screen.getByText('Analysis')).toHaveClass('disabled')
})

function renderHome() {
  render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route element={<HomePage />} index />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}
