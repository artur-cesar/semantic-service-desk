import type { AppPrismaClient } from '../../src/database/prisma.js'

import { ActorType } from '../../src/generated/prisma/enums.js'
import { seedIds } from './seed-ids.js'

export async function seedIdentityAndOrganization(prisma: AppPrismaClient) {
  const purchasing = await prisma.department.upsert({
    create: {
      code: 'PURCHASING',
      description: 'Department responsible for organizational purchasing.',
      id: seedIds.departments.purchasing,
      name: 'Purchasing',
    },
    update: {
      active: true,
      description: 'Department responsible for organizational purchasing.',
      name: 'Purchasing',
    },
    where: { code: 'PURCHASING' },
  })

  await prisma.department.upsert({
    create: {
      code: 'FINANCE',
      description: 'Department responsible for financial operations.',
      id: seedIds.departments.finance,
      name: 'Finance',
    },
    update: {
      active: true,
      description: 'Department responsible for financial operations.',
      name: 'Finance',
    },
    where: { code: 'FINANCE' },
  })

  const informationTechnology = await prisma.department.upsert({
    create: {
      code: 'INFORMATION_TECHNOLOGY',
      description: 'Department responsible for technology services.',
      id: seedIds.departments.informationTechnology,
      name: 'Information Technology',
    },
    update: {
      active: true,
      description: 'Department responsible for technology services.',
      name: 'Information Technology',
    },
    where: { code: 'INFORMATION_TECHNOLOGY' },
  })

  const teams = [
    {
      code: 'ERP_SUPPORT',
      description: 'Resolves functional and access-related ERP requests.',
      id: seedIds.teams.erpSupport,
      name: 'ERP Support',
    },
    {
      code: 'PLATFORM_OPERATIONS',
      description: 'Operates the technical platform and infrastructure.',
      id: seedIds.teams.platformOperations,
      name: 'Platform Operations',
    },
    {
      code: 'IDENTITY_AND_ACCESS',
      description: 'Manages identities and access across business systems.',
      id: seedIds.teams.identityAndAccess,
      name: 'Identity and Access',
    },
  ] as const

  for (const team of teams) {
    await prisma.team.upsert({
      create: { ...team, departmentId: informationTechnology.id },
      update: {
        active: true,
        departmentId: informationTechnology.id,
        description: team.description,
        name: team.name,
      },
      where: { code: team.code },
    })
  }

  const actors = [
    {
      departmentId: purchasing.id,
      email: 'joao@example.com',
      id: seedIds.actors.joao,
      name: 'João',
    },
    {
      departmentId: informationTechnology.id,
      email: 'carla@example.com',
      id: seedIds.actors.carla,
      name: 'Carla',
    },
    {
      departmentId: informationTechnology.id,
      email: 'diego@example.com',
      id: seedIds.actors.diego,
      name: 'Diego',
    },
  ] as const

  for (const actor of actors) {
    await prisma.actor.upsert({
      create: { ...actor, type: ActorType.HUMAN },
      update: {
        active: true,
        departmentId: actor.departmentId,
        name: actor.name,
        type: ActorType.HUMAN,
      },
      where: { email: actor.email },
    })
  }

  const capabilities = [
    {
      code: 'ERP_ACCESS_MANAGEMENT',
      description: 'Manages user access and authorization in the ERP.',
      id: seedIds.capabilities.erpAccessManagement,
      name: 'ERP Access Management',
    },
    {
      code: 'ERP_FUNCTIONAL_SUPPORT',
      description: 'Provides functional support for ERP business processes.',
      id: seedIds.capabilities.erpFunctionalSupport,
      name: 'ERP Functional Support',
    },
    {
      code: 'IDENTITY_MANAGEMENT',
      description: 'Manages user identities and their lifecycle.',
      id: seedIds.capabilities.identityManagement,
      name: 'Identity Management',
    },
    {
      code: 'PLATFORM_OPERATIONS',
      description: 'Operates application platforms and infrastructure.',
      id: seedIds.capabilities.platformOperations,
      name: 'Platform Operations',
    },
  ] as const

  for (const capability of capabilities) {
    await prisma.capability.upsert({
      create: capability,
      update: {
        active: true,
        description: capability.description,
        name: capability.name,
      },
      where: { code: capability.code },
    })
  }
}
