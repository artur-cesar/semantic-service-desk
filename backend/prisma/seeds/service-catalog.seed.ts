import type { AppPrismaClient } from '../../src/database/prisma.js'

import { seedIds } from './seed-ids.js'

export async function seedServiceCatalog(prisma: AppPrismaClient) {
  const erp = await prisma.businessSystem.upsert({
    create: {
      code: 'ERP',
      description: 'Enterprise resource planning system.',
      id: seedIds.businessSystems.erp,
      name: 'ERP',
    },
    update: {
      active: true,
      description: 'Enterprise resource planning system.',
      name: 'ERP',
    },
    where: { code: 'ERP' },
  })

  await prisma.businessSystem.upsert({
    create: {
      code: 'IDENTITY_PROVIDER',
      description: 'Central identity and authentication provider.',
      id: seedIds.businessSystems.identityProvider,
      name: 'Identity Provider',
    },
    update: {
      active: true,
      description: 'Central identity and authentication provider.',
      name: 'Identity Provider',
    },
    where: { code: 'IDENTITY_PROVIDER' },
  })

  const actions = [
    {
      code: 'CREATE_PURCHASE_ORDER',
      description: 'Creates a purchase order in the ERP.',
      id: seedIds.businessActions.createPurchaseOrder,
      name: 'Create Purchase Order',
    },
    {
      code: 'APPROVE_PURCHASE_ORDER',
      description: 'Approves a purchase order in the ERP.',
      id: seedIds.businessActions.approvePurchaseOrder,
      name: 'Approve Purchase Order',
    },
    {
      code: 'VIEW_FINANCIAL_REPORT',
      description: 'Views a financial report in the ERP.',
      id: seedIds.businessActions.viewFinancialReport,
      name: 'View Financial Report',
    },
  ] as const

  for (const action of actions) {
    await prisma.businessAction.upsert({
      create: { ...action, systemId: erp.id },
      update: {
        active: true,
        description: action.description,
        name: action.name,
        systemId: erp.id,
      },
      where: { code: action.code },
    })
  }

  const access = await prisma.ticketCategory.upsert({
    create: {
      code: 'ACCESS',
      description: 'Requests and incidents related to system access.',
      id: seedIds.categories.access,
      name: 'Access',
    },
    update: {
      active: true,
      description: 'Requests and incidents related to system access.',
      name: 'Access',
      parentId: null,
    },
    where: { code: 'ACCESS' },
  })

  const incident = await prisma.ticketCategory.upsert({
    create: {
      code: 'INCIDENT',
      description: 'Unexpected interruption or degradation of a service.',
      id: seedIds.categories.incident,
      name: 'Incident',
    },
    update: {
      active: true,
      description: 'Unexpected interruption or degradation of a service.',
      name: 'Incident',
      parentId: null,
    },
    where: { code: 'INCIDENT' },
  })

  const categories = [
    {
      code: 'MISSING_PERMISSION',
      description: 'The actor does not have the required system permission.',
      id: seedIds.categories.missingPermission,
      name: 'Missing Permission',
      parentId: access.id,
    },
    {
      code: 'ACCOUNT_LOCKED',
      description: 'The actor account is locked.',
      id: seedIds.categories.accountLocked,
      name: 'Account Locked',
      parentId: access.id,
    },
    {
      code: 'INCORRECT_ROLE',
      description: 'The actor has an incorrect role assignment.',
      id: seedIds.categories.incorrectRole,
      name: 'Incorrect Role',
      parentId: access.id,
    },
    {
      code: 'SERVICE_UNAVAILABLE',
      description: 'The affected service cannot be reached.',
      id: seedIds.categories.serviceUnavailable,
      name: 'Service Unavailable',
      parentId: incident.id,
    },
  ] as const

  for (const category of categories) {
    await prisma.ticketCategory.upsert({
      create: category,
      update: {
        active: true,
        description: category.description,
        name: category.name,
        parentId: category.parentId,
      },
      where: { code: category.code },
    })
  }
}
